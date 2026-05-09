import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa'
import { MdOutlinePlaylistAdd, MdPlaylistAddCheck } from 'react-icons/md'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useYouTube } from '../youtuneContext'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

const VideoPlayer = () => {
	const location = useLocation()
	const {
		subscriptions,
		setSubscriptions,
		subscribeChannel,
		unSubscribeChannel,
		token,
		addToHistory,
		toggleLike,
		likes,
		toggleWatchLater,
		watchLater,
	} = useYouTube()

	const { video, videos } = location.state || {}
	const [fullVideo, setFullVideo] = useState(video || null)
	const [relatedVideos, setRelatedVideos] = useState([])
	const [thumbnail, setThumbnail] = useState('null')
	const { id } = useParams()
	const videoId = video?.id?.videoId || video?.id || id

	const fetchVideos = useCallback(
		async (pageToken = '') => {
			try {
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
							videoCategoryId: video?.snippet?.categoryId,
						},
					},
				)

				const items = res.data.items || []
				setRelatedVideos(prev => {
					const newVideos = items.filter(v => !prev.some(p => p.id === v.id))
					return [...prev, ...newVideos]
				})
			} catch (err) {
				console.error('Error fetching videos:', err)
			}
		},
		[video?.snippet?.categoryId],
	)

	useEffect(() => {
		async function loadFullDetails() {
			let finalVideo = null
			// Search API does NOT provide categoryId, statistics, etc
			if (!video?.snippet?.categoryId) {
				try {
					const res = await axios.get(
						'https://www.googleapis.com/youtube/v3/videos',
						{
							params: {
								part: 'snippet,statistics,contentDetails',
								id: videoId,
								key: API_KEY,
							},
						},
					)
					finalVideo = res.data.items[0]
					setFullVideo(finalVideo)
				} catch (err) {
					console.error('Failed to load full video details', err)
				}
			} else {
				finalVideo = video
				setFullVideo(video)
			}

			// Add to Firestore history if logged in
			if (finalVideo) {
				// We now add to history in the channelStats effect to include subscriber count
			}
		}

		loadFullDetails()
	}, [videoId])

	// useEffect(() => {
	//   if (!fullVideo?.snippet?.categoryId) return; // wait until loaded

	//   async function fetchRelated() {
	//     try {
	//       const response = await axios.get(
	//         "https://www.googleapis.com/youtube/v3/search",
	//         {
	//           params: {
	//             part: "snippet",
	//             maxResults: 50,
	//             type: "video",
	//             relatedToVideoId: videoId,
	//             key: API_KEY,
	//           },
	//         }
	//       );
	//       setRelatedVideos(response.data.items);
	//     } catch (err) {
	//       console.error("Failed to load related videos", err);
	//     }
	//   }

	//   fetchRelated();
	// }, [videoId, fullVideo]);
	// console.log(relatedVideos);

	useEffect(() => {
		// setRelatedVideos([]); // reset when opening new video
		fetchVideos() // load category videos
	}, [videoId])
	useEffect(() => {
		if (!video && id) {
			async function fetchDirectVideo() {
				try {
					const res = await axios.get(
						'https://www.googleapis.com/youtube/v3/videos',
						{
							params: {
								part: 'snippet,statistics,contentDetails',
								id,
								key: API_KEY,
							},
						},
					)
					setFullVideo(res.data.items[0])
				} catch (err) {
					console.error('Failed to fetch direct video', err)
				}
			}

			fetchDirectVideo()
		}
	}, [id, video])
	// console.log(video);

	// console.log(relatedVideos);
	// fetch channel photo

	const isSubscribed = subscriptions.some(
		sub => sub.snippet.resourceId.channelId === video.snippet.channelId,
	)

	// console.log(video);
	console.log(fullVideo)

	const [channelStats, setChannelStats] = useState(null)

	useEffect(() => {
		if (!video?.snippet?.channelId) return

		axios
			.get('https://www.googleapis.com/youtube/v3/channels', {
				params: {
					part: 'snippet,statistics',
					id: video.snippet.channelId,
					key: API_KEY,
				},
			})
			.then(res => {
				const channel = res.data.items?.[0]
				if (channel) {
					setThumbnail(channel.snippet.thumbnails.default.url)
					setChannelStats(channel.statistics)
					
					// Also update history with subscriber count
					if (fullVideo || video) {
						addToHistory({
							...(fullVideo || video),
							channelSubscriberCount: channel.statistics?.subscriberCount 
								? Number(channel.statistics.subscriberCount).toLocaleString() 
								: null
						});
					}
				}
			})
			.catch(err => console.error('Error fetching channel details:', err))
	}, [video?.snippet?.channelId, fullVideo])
	// console.log(thumbnail);

	return (
		<div className=' w-full relative    gap-[calc(1rem+1vw)]   flex justify-between '>
			{/* Video Player */}
			<div className='w-full fixed  lg:relative  left-0  top-[calc(2rem+2vw)] lg:w-7/10  md:top-[calc(2.5rem+2.5vw)] lg:top-0 z-9 bg-background'>
				<iframe
					allow='autoplay'
					allowFullScreen
					className='w-full lg:rounded-[15px]  h-[calc(8rem+22vw)] md:h-[calc(9rem+25vw)]'
					src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
					title={video.snippet.title}
				></iframe>
				<div className='max-lg:hidden px-[calc(1rem+1vw)] py-[calc(.7em+.5vw)]'>
					{/* video info laptop */}
					<h3 className='line-clamp-2 text-[clamp(1.05rem,1.3vw,3rem)] font-medium leading-tight text-primary1'>
						{video.snippet.title}
					</h3>

					<div className='flex items-center justify-between mt-4'>
						<div className='flex items-center gap-3'>
							<Link
								to={`/subscriptionslist/${video.snippet.channelId}`}
								className='flex-shrink-0'
							>
								<img
									loading='lazy'
									src={
										video.channelThumbnail ||
										(thumbnail !== 'null' ? thumbnail : '')
									}
									alt={video.snippet.channelTitle}
									className='rounded-full w-10 h-10 object-cover'
								/>
							</Link>
							<div className='flex flex-col'>
								<p className='text-primary1 font-bold text-base'>
									{video.snippet.channelTitle}
								</p>
								<p className='text-secondary2 text-xs'>
									{channelStats?.subscriberCount
										? `${Number(channelStats.subscriberCount).toLocaleString()} subscribers`
										: 'Subscribers hidden'}
								</p>
							</div>
							<button
								disabled={!token}
								onClick={() =>
									isSubscribed
										? unSubscribeChannel(
												video.snippet.channelId,
												video.snippet.channelTitle,
											)
										: subscribeChannel(
												video.snippet.channelId,
												video.snippet.channelTitle,
											)
								}
								className={`ml-4 px-4 py-2 rounded-full font-medium transition-all text-sm ${
									isSubscribed
										? 'bg-zinc-800 text-white hover:bg-zinc-700'
										: 'bg-white text-black hover:bg-zinc-200'
								} ${!token ? 'opacity-50 cursor-not-allowed' : ''}`}
							>
								{isSubscribed ? 'Subscribed' : 'Subscribe'}
							</button>
						</div>
						<div className='flex items-center gap-2 ml-auto'>
							<button
								onClick={() => {
									const videoToSave = { 
										...(fullVideo || video), 
										channelSubscriberCount: channelStats?.subscriberCount 
											? Number(channelStats.subscriberCount).toLocaleString() 
											: null 
									};
									toggleLike(videoToSave);
								}}
								className='flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full font-medium transition-all text-sm'
							>
								{likes.some(
									v =>
										(v.id?.videoId || v.id) === (video.id?.videoId || video.id),
								) ? (
									<FaThumbsUp className='text-primary1' />
								) : (
									<FaRegThumbsUp />
								)}
								{fullVideo?.statistics?.likeCount
									? Number(fullVideo.statistics.likeCount).toLocaleString()
									: 'Like'}
							</button>

							<button
								onClick={() => {
									const videoToSave = { 
										...(fullVideo || video), 
										channelSubscriberCount: channelStats?.subscriberCount 
											? Number(channelStats.subscriberCount).toLocaleString() 
											: null 
									};
									toggleWatchLater(videoToSave);
								}}
								className='flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full font-medium transition-all text-sm'
							>
								{watchLater.some(
									v =>
										(v.id?.videoId || v.id) === (video.id?.videoId || video.id),
								) ? (
									<MdPlaylistAddCheck className='text-xl text-primary1' />
								) : (
									<MdOutlinePlaylistAdd className='text-xl' />
								)}
								Save
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className='pt-[calc(10rem+11vw)] lg:pt-0 relative   w-full lg:w-3/10 '>
				{/* video details mobile */}
				<div className='lg:hidden'>
					{/* video info */}
					<div className='flex px-[calc(1rem+1vw)]  items-start justify-between  w-full'>
						<div className='  py-[calc(.7em+.5vw)] '>
							<h3 className='line-clamp-2 text-white text-[clamp(1.09rem,1.3vw,3rem)] font-[550] leading-tight'>
								{video.snippet.title}
							</h3>
							<div className='flex items-center line-clamp-2 text-secondary2 py-[calc(.2rem+.2vw)] gap-[calc(.1rem+.1vw)] text-[clamp(.74rem,.9vw,2rem)] '>
								{fullVideo && (
									<p>
										<span className='md:hidden'>
											{fullVideo.statistics && fullVideo?.snippet?.channelTitle}{' '}
											&middot;
										</span>{' '}
										{fullVideo?.statistics?.viewCount >= 1_000_000_000
											? `${(
													fullVideo.statistics.viewCount / 1_000_000_000
												).toFixed(0)}B views`
											: fullVideo.statistics &&
												  fullVideo.statistics.viewCount >= 1_000_000
												? `${(
														fullVideo.statistics.viewCount / 1_000_000
													).toFixed(0)}M views`
												: fullVideo.statistics &&
													  fullVideo.statistics.viewCount >= 1_000
													? `${(fullVideo.statistics.viewCount / 1_000).toFixed(
															0,
														)}K views`
													: `${
															fullVideo.statistics &&
															fullVideo.statistics.viewCount
														} views`}{' '}
										&middot;{' '}
										{formatDistanceToNow(new Date(video.snippet.publishedAt), {
											addSuffix: true,
										})}
									</p>
								)}
							</div>
						</div>
					</div>
					<div className='flex px-[calc(1rem+1vw)] gap-2 pb-4 overflow-x-auto no-scrollbar'>
						<button
							onClick={() => toggleLike(fullVideo || video)}
							className='flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap'
						>
							{likes.some(
								v =>
									(v.id?.videoId || v.id) === (video.id?.videoId || video.id),
							) ? (
								<FaThumbsUp className='text-primary1' />
							) : (
								<FaRegThumbsUp />
							)}
							Like
						</button>
						<button
							onClick={() => toggleWatchLater(fullVideo || video)}
							className='flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap'
						>
							{watchLater.some(
								v =>
									(v.id?.videoId || v.id) === (video.id?.videoId || video.id),
							) ? (
								<MdPlaylistAddCheck className='text-xl text-primary1' />
							) : (
								<MdOutlinePlaylistAdd className='text-xl' />
							)}
							Save
						</button>
					</div>
					<div className=' border flex px-[calc(1rem+1vw)] items-center justify-between gap-2 '>
						<Link to={`/subscriptionslist/${video.snippet.channelId}`}>
							<div className='flex items-center gap-2'>
								<img
									loading='lazy'
									src={video.channelThumbnail || thumbnail}
									alt='thumbnail'
									className='rounded-full w-[calc(1.8rem+2vw)]  h-auto'
								/>
								<div className='flex flex-col'>
									<p className='text-primary1 font-medium'>
										{video.snippet.channelTitle}
									</p>
									<p className='text-secondary2 text-xs'>
										{channelStats?.subscriberCount
											? `${Number(channelStats.subscriberCount).toLocaleString()} subscribers`
											: 'Subscribers hidden'}
									</p>
								</div>
							</div>
						</Link>
						<button
							disabled={!token}
							onClick={() =>
								isSubscribed
									? unSubscribeChannel(
											video.snippet.channelId,
											video.snippet.channelTitle,
										)
									: subscribeChannel(
											video.snippet.channelId,
											video.snippet.channelTitle,
										)
							}
							className={`border rounded-[18px] px-[calc(.7rem+.5vw)] py-[calc(.35rem+.4vw)] text-[clamp(.86rem,1vw,2.8rem)] font-medium font-inter transition-all ${
								isSubscribed
									? 'bg-zinc-800 text-white border-zinc-700'
									: 'bg-primary1 text-background border-transparent'
							} ${!token ? 'opacity-50 cursor-not-allowed' : ''}`}
						>
							{isSubscribed ? 'Subscribed' : 'Subscribe'}
						</button>
					</div>
				</div>
				{/* related videos */}
				{relatedVideos.length > 0 ? (
					<div className='flex flex-col gap-3 lg:gap-2 px-[calc(.5rem+1vw)] lg:px-0'>
						{relatedVideos
							.filter(v => v.id !== videoId)
							.map(v => (
								<Link
									key={v.id}
									to={`/video/${v.id}`}
									state={{ video: v, videos }}
									className='group'
								>
									<div className='w-full flex gap-3 bg-background overflow-hidden rounded-lg transition-colors hover:bg-zinc-900/50'>
										<div className='relative w-[40%] aspect-video flex-shrink-0 bg-zinc-800 rounded-lg overflow-hidden'>
											<img
												src={v.snippet.thumbnails.medium.url}
												alt={v.snippet.title}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
											/>
										</div>
										<div className='flex-1 py-0.5 min-w-0 pr-2'>
											<h4 className='text-[clamp(.85rem,.85vw,2.5rem)] font-medium line-clamp-2 text-primary1 leading-snug'>
												{v.snippet.title}
											</h4>
											<div className='mt-1 flex flex-col gap-0.5'>
												<p className='text-secondary2 text-[clamp(.75rem,.75vw,2rem)] line-clamp-1'>
													{v.snippet.channelTitle}
												</p>
												<p className='text-[clamp(.7rem,.72vw,2rem)] text-secondary2 line-clamp-1'>
													{v.statistics?.viewCount ? (
														<>
															{Number(v.statistics.viewCount) >= 1_000_000_000
																? `${(Number(v.statistics.viewCount) / 1_000_000_000).toFixed(1)}B views`
																: Number(v.statistics.viewCount) >= 1_000_000
																	? `${(Number(v.statistics.viewCount) / 1_000_000).toFixed(1)}M views`
																	: Number(v.statistics.viewCount) >= 1_000
																		? `${(Number(v.statistics.viewCount) / 1_000).toFixed(0)}K views`
																		: `${v.statistics.viewCount} views`}
														</>
													) : (
														'No views'
													)}{' '}
													&middot;{' '}
													{formatDistanceToNow(
														new Date(v.snippet.publishedAt),
														{
															addSuffix: true,
														},
													)}
												</p>
											</div>
										</div>
									</div>
								</Link>
							))}
					</div>
				) : (
					<p className='px-[calc(1rem+1vw)] pt-[calc(1rem+3vw)] text-center text-secondary2'>
						No related videos found 😔
					</p>
				)}
			</div>
		</div>
	)
}

export default VideoPlayer
