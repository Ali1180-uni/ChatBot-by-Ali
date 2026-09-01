import { Link } from "react-router-dom";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

function About() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-[#89867e]">
          A little context
        </p>
        <h1 className="max-w-3xl font-display text-6xl font-bold leading-[.96] tracking-[-0.07em] sm:text-8xl">
          Technology should feel more{" "}
          <span className="font-editorial text-[#8a8880]">human.</span>
        </h1>
        <div className="mt-16 grid gap-12 border-t border-[#d0cdc4] pt-10 md:grid-cols-[1fr_1.5fr]">
          <p className="font-display text-2xl font-semibold leading-tight tracking-[-0.04em]">
            Ali.ai is a focused space for turning half-formed thoughts into
            clear next steps.
          </p>
          <div className="max-w-2xl text-base leading-8 text-[#6f6d68]">
            <p>
              Built by M. Ali Tahir, Ali.ai brings an approachable interface to
              the power of modern AI. It is designed for the everyday moments
              when a second brain would help: learning something difficult,
              drafting a plan, or simply asking a better question.
            </p>
            <p className="mt-6">
              Your conversations are connected to your account so your work can
              stay with you. The experience stays intentionally quiet, letting
              the exchange take center stage.
            </p>
          </div>
        </div>
        <div className="mt-20 grid gap-4 md:grid-cols-3">
          <div className="border-t-2 border-[#292929] pt-5">
            <PsychologyOutlinedIcon />
            <h2 className="mt-8 font-display text-xl font-bold">Curious</h2>
            <p className="mt-2 text-sm leading-6 text-[#77746d]">
              Made to explore ideas from the first spark to the useful detail.
            </p>
          </div>
          <div className="border-t-2 border-[#292929] pt-5">
            <SecurityOutlinedIcon />
            <h2 className="mt-8 font-display text-xl font-bold">Considered</h2>
            <p className="mt-2 text-sm leading-6 text-[#77746d]">
              Your account keeps your conversations organized and close at hand.
            </p>
          </div>
          <div className="border-t-2 border-[#292929] pt-5">
            <FavoriteBorderIcon />
            <h2 className="mt-8 font-display text-xl font-bold">Human</h2>
            <p className="mt-2 text-sm leading-6 text-[#77746d]">
              A warm, uncluttered place to think out loud without friction.
            </p>
          </div>
        </div>
        <Link
          to="/chat"
          className="mt-16 inline-flex items-center gap-2 text-sm font-bold text-[#292929] underline decoration-[#aaa69d] underline-offset-8"
        >
          Meet the assistant <ArrowOutwardIcon fontSize="small" />
        </Link>
      </section>
    </main>
  );
}

export default About;
