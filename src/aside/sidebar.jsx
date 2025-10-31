import { FaBars } from "react-icons/fa6";

function Sidebar() {
  return (
    <>
      <section className="border z-20 flex flex-col w-fit h-screen fixed top-0 pt-[calc(1rem+1vw)] px-[calc(.6rem+.8vw)] left-0">
        <FaBars className="icons " />
      </section>
    </>
  );
}
export default Sidebar;
