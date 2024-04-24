import Link from "next/link"

export default function HeroSection() {
  return (
    <section>
    <div className="hero min-h-screen" style={{backgroundImage: 'url(https://images.pexels.com/photos/935949/pexels-photo-935949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'}}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-3xl">
          <h1 className="mb-5 text-5xl font-bold"> Empowering Mentorship: Connect with Your Perfect Guide</h1>
          <p className="mb-5">Welcome to our Mentorship School, where guidance meets opportunity. Whether you&apos;re navigating your career path, exploring new skills, or seeking personal growth, our platform connects you with experienced mentors ready to empower your journey. From industry veterans to niche experts, find the mentor whose insights align with your aspirations. Unlock your potential today and start meaningful conversations that propel you towards success.</p>
          <Link href={"/mentors"}><button className="btn btn-primary">Get Started</button></Link>
        </div>
      </div>
    </div>
    </section>
  )
}
