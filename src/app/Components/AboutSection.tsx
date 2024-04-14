export default function AboutSection() {
  return (
    <section className="bg-base-200">
        <div className="pt-10">
            <h1 className="text-center font-bold text-4xl">The MentorHub Difference</h1>
            <p className="text-center md:mx-64 my-4">Co-created by world-renowned mentoring expert, Dr. Jean Rhodes, Ph.D., MentorHub is the only mentoring platform built by and for youth-serving nonprofits to help youth-serving programs of different sizes and models improve mentoring practice and deliver high-impact mentoring to more people.</p>
        </div>
        <div className="hero md:min-h-screen">
          <div className="hero-content flex-col lg:flex-row">
            <img src="https://images.pexels.com/photos/1181487/pexels-photo-1181487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="w-[80vw] h-[40vh] md:w-[30vw] md:h-[60vh]  object-cover rounded-full shadow-2xl" alt="Mentor Image"/>
            <div className="md:mx-10">
              <h1 className="text-3xl md:text-5xl text-center font-bold">So Much More Than a Communication Tool</h1>
              <p className="py-6">Virtual communication is just the beginning. Matches that meet in person can still use MentorHub to set and track progress on goals, get suggestions for activities, and access program support in real time without ever using the platform for communication.</p>
            </div>
          </div>
        </div>
    </section>
  )
}
