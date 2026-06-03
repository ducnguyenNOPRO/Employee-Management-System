import { Link } from "react-router-dom";
import GmDashboard from "@/assets/GmDashboard.png";
import EmployeeShift from "@/assets/EmployeeShift.png";
import Schedules from "@/assets/schedules.png";
import LeaveRequest from "@/assets/LeaveRequest.png";
import EmployeeLeave from "@/assets/EmployeeRequest.png";
import LiveAttendance from "@/assets/LiveAttendance.png";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-serif">
      {/* ── Topbar ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-black tracking-tight text-slate-900">
              ShiftSync
            </span>
          </div>
          <nav className="flex items-center gap-8">
            <a
              href="#features"
              className="font-sans text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#contact"
              className="font-sans text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Contact
            </a>
            <Link
              to="/login"
              className="font-sans text-sm font-semibold px-5 py-2 border-2 border-slate-900 rounded-lg hover:bg-slate-900 hover:text-white transition-all"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center overflow-hidden min-h-[88vh]">
          {/* bg glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_50%,#eff6ff,transparent)] pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-block font-sans text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-6">
              Workforce Management
            </span>
            <h1 className="text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 mb-6">
              Your team, <br />
              <span className="text-blue-600 italic">perfectly in sync.</span>
            </h1>
            <p className="font-sans text-lg leading-relaxed text-slate-500 max-w-md mb-10">
              ShiftSync brings scheduling, attendance, and leave management into
              one clean workspace — for managers and employees alike.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                to="/login"
                className="font-sans font-bold text-sm px-7 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:-translate-y-0.5"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="font-sans text-sm text-slate-400 hover:text-slate-700 transition-colors"
              >
                See Features ↓
              </a>
            </div>
          </div>

          {/* Screenshot stack */}
          <div className="relative flex items-center justify-center pb-16">
            {/* Back image */}
            <img
              src={GmDashboard}
              alt="Manager Dashboard"
              className="w-[85%] rounded-xl border border-slate-200 shadow-2xl"
            />
            {/* Front image — overlaps bottom-left */}
            <img
              src={LiveAttendance}
              alt="Live Attendance"
              className="absolute bottom-[-10%] left-[-2%] md:left-[-4%] w-[60%] rounded-xl border border-slate-200 shadow-[0_24px_64px_rgba(0,0,0,0.18)] z-20"
            />
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────── */}
        <section id="features" className="bg-slate-50 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <p className="font-sans text-xs font-bold tracking-widest uppercase text-blue-600 mb-2">
              Features
            </p>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-14">
              Built for every role
            </h2>

            {/* For Managers */}
            <div className="mb-14">
              <div className="mb-6">
                <span className="font-sans text-xs font-bold tracking-widest uppercase text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full">
                  For Managers
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-3">
                  Run your team with confidence
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <FeatureCard
                  img={Schedules}
                  imgDark
                  icon="📅"
                  title="Shift Scheduler"
                  desc="Build weekly schedules on a visual calendar, apply shifts across multiple days, and publish to your team in one click."
                />
                <FeatureCard
                  img={LeaveRequest}
                  imgDark
                  icon="✅"
                  title="Leave Approvals"
                  desc="Review pending vacation and sick leave requests, approve or reject with one click, and track all decisions in one place."
                />
              </div>
            </div>

            {/* For Employees */}
            <div>
              <div className="mb-6">
                <span className="font-sans text-xs font-bold tracking-widest uppercase text-green-800 bg-green-100 border border-green-200 px-3 py-1 rounded-full">
                  For Employees
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-3">
                  Everything you need, at a glance
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <FeatureCard
                  img={EmployeeShift}
                  icon="🕐"
                  title="My Shifts"
                  desc="See today's shift and your upcoming schedule for the next two weeks. Always know when and where you're needed."
                />
                <FeatureCard
                  img={EmployeeLeave}
                  icon="🏖️"
                  title="Leave Requests"
                  desc="Check your vacation and sick leave balances, submit new requests, and track approval status — all from one screen."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────── */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <p className="font-sans text-xs font-bold tracking-widest uppercase text-blue-600 mb-2">
              How it works
            </p>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-14">
              Up and running in seconds
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {[
                {
                  n: "01",
                  title: "Sign in",
                  desc: "Log in with your work credentials. No setup needed — your account is ready.",
                },
                {
                  n: "02",
                  title: "See your workspace",
                  desc: "Managers land on the dashboard. Employees see today's shift immediately.",
                },
                {
                  n: "03",
                  title: "Take action",
                  desc: "Approve leaves, publish schedules, clock in, or request time off — all in a few clicks.",
                },
              ].map((s) => (
                <div
                  key={s.n}
                  className="p-8 border border-slate-200 rounded-2xl"
                >
                  <p className="text-5xl font-black text-slate-300 leading-none mb-4 font-serif">
                    {s.n}
                  </p>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    {s.title}
                  </h4>
                  <p className="font-sans text-sm leading-relaxed text-slate-500">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="bg-slate-900 py-24">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white mb-4">
              Ready to sync your team?
            </h2>
            <p className="font-sans text-lg text-slate-400 mb-10">
              Sign in and get your team organised today.
            </p>
            <Link
              to="/login"
              className="font-sans font-bold text-base px-10 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all hover:-translate-y-0.5 inline-block"
            >
              Sign In →
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer id="contact" className="bg-slate-950 pt-16 pb-0">
        <div className="max-w-6xl mx-auto px-6 pb-12 grid grid-cols-3 gap-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-black tracking-tight text-white">
                ShiftSync
              </span>
            </div>
            <p className="font-sans text-sm text-slate-500">
              Workforce management made simple.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-sans text-xs font-bold tracking-widest uppercase text-white mb-2">
              Contact Us
            </p>
            <a
              href="mailto:support@shiftsync.io"
              className="font-sans text-sm text-slate-500 hover:text-white transition-colors"
            >
              support@shiftsync.io
            </a>
            <a
              href="tel:+11234567890"
              className="font-sans text-sm text-slate-500 hover:text-white transition-colors"
            >
              +1 (123) 456-7890
            </a>
            <p className="font-sans text-sm text-slate-500">
              123 Main Street, Everett, WA 98208
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-sans text-xs font-bold tracking-widest uppercase text-white mb-2">
              Product
            </p>
            <a
              href="#features"
              className="font-sans text-sm text-slate-500 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#contact"
              className="font-sans text-sm text-slate-500 hover:text-white transition-colors"
            >
              Contact
            </a>
            <Link
              to="/login"
              className="font-sans text-sm text-slate-500 hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-5 border-t border-slate-800">
          <p className="font-sans text-xs text-slate-600">
            © {new Date().getFullYear()} ShiftSync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ── Reusable feature card ─────────────────────────────────────────────────────
function FeatureCard({
  img,
  imgDark = false,
  icon,
  title,
  desc,
}: {
  img: string;
  imgDark?: boolean;
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <div className={`${imgDark ? "bg-slate-800" : "bg-slate-100"} px-5 pt-5`}>
        <img
          src={img}
          alt={title}
          className="w-full rounded-t-lg object-cover object-top max-h-52"
        />
      </div>
      <div className="p-6">
        <p className="text-2xl mb-3">{icon}</p>
        <h4 className="font-bold text-lg text-slate-900 mb-1">{title}</h4>
        <p className="font-sans text-sm leading-relaxed text-slate-500">
          {desc}
        </p>
      </div>
    </div>
  );
}
