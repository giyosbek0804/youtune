import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import { parse } from 'iso8601-duration'
import { useCallback, useEffect, useRef, useState } from 'react'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { useYouTube } from '../../youtuneContext'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

function Content() {
	const [videos, setVideos] = useState([])
	const [nextPageToken, setNextPageToken] = useState('')
	const [loading, setLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [videosLength, setVideosLength] = useState(0)
	const observerRef = useRef(null)
	const loadingRef = useRef(false) // keeps the live loading value

	const {
		filter,
		setFilter,
		searchQuery,
		setSearchQuery,
		token,
		subscriptions,
	} = useYouTube()

	// Sync ref whenever loading changes
	useEffect(() => {
		loadingRef.current = loading
	}, [loading])
	function getCategoryId(filter) {
		const map = {
			all: null, // all categories
			films: 1,
			cars: 2,
			music: 10,
			animals: 15,
			sports: 17,
			gaming: 20,
			blogs: 22,
			comedy: 23,
			entertainment: 24,
			news: 25,
			style: 26,
			science: 28,
		}

		return map[filter] || null
	}
	// Fetch videos
	const fetchVideos = useCallback(
		async (pageToken = '') => {
			if (loadingRef.current) return
			setLoading(true)

			try {
				let allItems = []
				let newNextPage = ''

				if (
					token &&
					(filter === 'all' || !filter) &&
					subscriptions?.length > 0
				) {
					try {
						// 1. Fetch from subscriptions ONLY (top 10 channels)
						const subRequests = subscriptions.slice(0, 10).map(sub =>
							axios
								.get('https://www.googleapis.com/youtube/v3/search', {
									params: {
										part: 'snippet',
										channelId: sub.snippet.resourceId.channelId,
										order: 'date',
										maxResults: 5,
										type: 'video',
										key: API_KEY,
									},
								})
								.catch(() => ({ data: { items: [] } })),
						)

						const subResponses = await Promise.all(subRequests)
						subResponses.forEach(res =>
							allItems.push(...(res.data.items || [])),
						)

						// 2. Fetch full details (statistics/views) for these search results
						if (allItems.length > 0) {
							const videoIds = allItems
								.map(v => v.id?.videoId || v.id)
								.join(',')
							const statsRes = await axios.get(
								'https://www.googleapis.com/youtube/v3/videos',
								{
									params: {
										part: 'snippet,statistics,contentDetails',
										id: videoIds,
										key: API_KEY,
									},
								},
							)
							allItems = statsRes.data.items || allItems
						}

						// 3. Sort by date
						allItems.sort(
							(a, b) =>
								new Date(b.snippet.publishedAt) -
								new Date(a.snippet.publishedAt),
						)

						if (allItems.length === 0) {
							console.log('No videos found in subscriptions.')
						}
					} catch (e) {
						console.error('Sub feed failed:', e)
					}
				} else {
					const res = await axios.get(
						'https://www.googleapis.com/youtube/v3/videos',
						{
							params: {
								part: 'snippet,contentDetails,statistics',
								chart: 'mostPopular',
								regionCode: 'US',
								maxResults: 50,
								order: 'viewCount',
								key: API_KEY,
								pageToken: pageToken || undefined,
								videoCategoryId: getCategoryId(filter),
							},
						},
					)
					allItems = res.data.items || []
					newNextPage = res.data.nextPageToken || ''
				}

				// Fetch channel thumbnails
				const channelIds = [
					...new Set(allItems.map(v => v.snippet.channelId)),
				].join(',')
				let channelMap = {}
				if (channelIds) {
					const chRes = await axios.get(
						'https://www.googleapis.com/youtube/v3/channels',
						{
							params: { part: 'snippet', id: channelIds, key: API_KEY },
						},
					)
					;(chRes.data.items || []).forEach(ch => {
						channelMap[ch.id] = ch.snippet?.thumbnails?.default?.url || ''
					})
				}

				const itemsWithChannels = allItems.map(v => ({
					...v,
					channelThumbnail: channelMap[v.snippet.channelId] || '',
					id: v.id?.videoId || v.id, // Crucial for Search API vs Videos API
				}))

				setVideos(prev => {
					const newVideos = itemsWithChannels.filter(
						v =>
							!prev.some(
								p => (p.id?.videoId || p.id) === (v.id?.videoId || v.id),
							),
					)
					return [...prev, ...newVideos]
				})
				setNextPageToken(newNextPage)
				setHasMore(Boolean(newNextPage))
			} catch (err) {
				console.error('Error fetching videos:', err)
			} finally {
				setLoading(false)
			}
		},
		[filter, token, subscriptions],
	)

	// format video duration
	const formatDuration = isoDuration => {
		const { days = 0, hours = 0, minutes = 0, seconds = 0 } = parse(isoDuration)

		// Function to add leading zero if needed
		const pad = num => String(num).padStart(2, '0')

		if (days > 0) {
			// days format
			return `${days}:${hours}:${pad(minutes)}:${pad(seconds)}`
		} else if (days > 0) {
			// hours format
			return `${hours}:${pad(minutes)}:${pad(seconds)}`
		} else {
			// minute format
			return `${minutes}:${pad(seconds)}`
		}
	}
	// First load
	useEffect(() => {
		// clear old videos first
		setVideos([])
		setNextPageToken('')

		// then load new filtered videos
		fetchVideos()
	}, [filter, token, subscriptions])

	// Observer logic
	const lastVideoRef = useCallback(
		node => {
			if (loadingRef.current) return
			setTimeout(() => {
				if (observerRef.current) observerRef.current.disconnect()

				observerRef.current = new IntersectionObserver(
					entries => {
						if (entries[0].isIntersecting && hasMore && nextPageToken) {
							fetchVideos(nextPageToken)
						}
					},
					{
						root: null,
						rootMargin: '200px',
						threshold: 0.1,
					},
				)
				if (node) observerRef.current.observe(node)
			}, 100)
		},
		[hasMore, nextPageToken],
	)

	return (
		<>
			<section
				className={`grid grid-cols-1 pb-[calc(3.5rem+3vw)] md:pb-0 sm:grid-cols-2 lg:grid-cols-3 bg-background justify-center pt-[calc(1rem+1vw)] ${
					videos.length > 0
						? ''
						: 'flex md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 w-full'
				} gap-x-4 gap-y-8 px-4`}
			>
				{videos.length > 0
					? videos.map((video, i) => {
							const isLastVideo = i === videos.length - 1

							return (
								<div
									key={video.id || i}
									ref={isLastVideo ? lastVideoRef : null}
									className='bg-background group'
								>
									<Link
										to={`/video/${video.id}`}
										state={{ video, videos }}
										className='block'
									>
										{/* Thumbnail with Duration */}
										<div className='relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-800'>
											<img
												loading='lazy'
												src={video.snippet.thumbnails.medium.url}
												alt={video.snippet.title}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
											/>
											{video.contentDetails?.duration && (
												<div className='absolute bottom-2 right-2 bg-black/80 text-white text-[12px] font-medium px-1.5 py-0.5 rounded-md'>
													{formatDuration(video.contentDetails.duration)}
												</div>
											)}
										</div>

										<div className='flex gap-3 mt-3'>
											{/* Channel Avatar */}
											<div className='flex-shrink-0 mt-0.5'>
												{video.channelThumbnail ? (
													<img
														src={video.channelThumbnail}
														alt={video.snippet.channelTitle}
														className='w-9 h-9 rounded-full object-cover'
													/>
												) : (
													<div className='w-9 h-9 rounded-full bg-zinc-800' />
												)}
											</div>

											<div className='flex flex-col min-w-0 pr-6 relative w-full'>
												{/* Video Title */}
												<h3 className='text-[16px] font-semibold text-primary1 line-clamp-2 leading-tight mb-1'>
													{video.snippet.title}
												</h3>

												{/* One-line Metadata: Channel • Views • Time */}
												<div className='flex flex-wrap items-center text-[12px] text-secondary2 mt-1 gap-1'>
													<div className='flex items-center gap-1 hover:text-primary1 transition-colors'>
														<span className='truncate'>
															{video?.snippet?.channelTitle}
														</span>
														{/* Mock verified checkmark */}
														<svg
															className='w-3 h-3 fill-current opacity-70'
															viewBox='0 0 24 24'
														>
															<path d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM9.8 17.3l-4.2-4.1L7 11.8l2.8 2.7L17 7.4l1.4 1.4-8.6 8.5z' />
														</svg>
													</div>
													<span className='text-[10px] opacity-50'>&bull;</span>
													<div className='flex items-center gap-1'>
														{video.statistics?.viewCount ? (
															<>
																{Number(video.statistics.viewCount) >=
																1_000_000_000
																	? `${(Number(video.statistics.viewCount) / 1_000_000_000).toFixed(1)}B views`
																	: Number(video.statistics.viewCount) >=
																		  1_000_000
																		? `${(Number(video.statistics.viewCount) / 1_000_000).toFixed(1)}M views`
																		: Number(video.statistics.viewCount) >=
																			  1_000
																			? `${(Number(video.statistics.viewCount) / 1_000).toFixed(0)}K views`
																			: `${video.statistics.viewCount} views`}
															</>
														) : (
															'No views'
														)}
													</div>
													<span className='text-[10px] opacity-50'>&bull;</span>
													<div>
														{video.snippet.publishedAt &&
															formatDistanceToNow(
																new Date(video.snippet.publishedAt),
																{ addSuffix: true },
															)}
													</div>
												</div>

												{/* 3 dots menu button */}
												<div className='absolute top-0 right-0 text-primary1 opacity-0 group-hover:opacity-100 transition-opacity'>
													<HiOutlineDotsVertical />
												</div>
											</div>
										</div>
									</Link>
								</div>
							)
						})
					: !loading && (
							<div className='pt-[calc(2rem+3vw)] px-[calc(.5rem+.5vw)]  w-full text-center text-primary1'>
								<p className=' text-[clamp(1.1rem,1.3vw,3rem)]    '>
									Sorry app reached daily qoute 😔{' '}
								</p>
								<p className='text-[clamp(1rem,1.2vw,2.8rem)]'>
									To know more about <i>quote</i> usage{' '}
									<Link to={'/quoteusage'} className='underline text-blue-500'>
										click here
									</Link>
								</p>
							</div>
						)}
			</section>
			{loading && (
				<div className='w-full mx-auto py-6  flex text-center '>
					<p className=' text-primary1  w-full'>Loading...</p>
				</div>
			)}
		</>
	)
}

export default Content
