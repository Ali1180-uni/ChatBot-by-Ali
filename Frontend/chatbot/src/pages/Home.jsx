import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CheckIcon from "@mui/icons-material/Check";

function Home() {
  const [greetings, setGreetings] = useState(() => {
    const cached = JSON.parse(localStorage.getItem("aliDailyGreetings") || "null");
    return cached?.date === new Date().toISOString().slice(0, 10) && cached.lines?.length === 2
      ? cached.lines
      : ["A clearer day starts with one good question.", "Take your next idea a little further."];
  });
  const greetingRequestStarted = useRef(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const cached = JSON.parse(localStorage.getItem("aliDailyGreetings") || "null");
    if (cached?.date === today && cached.lines?.length === 2) return;
    if (greetingRequestStarted.current) return;
    greetingRequestStarted.current = true;

    fetch("/api/greetings")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        if (data.lines?.length === 2) {
          setGreetings(data.lines);
          localStorage.setItem("aliDailyGreetings", JSON.stringify({ date: today, lines: data.lines }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="flex-1 overflow-hidden">
      <section className="relative mx-auto grid min-h-[680px] max-w-[1240px] items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <div className="relative z-10 animate-[rise_.7s_ease-out_both]">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#c9c6be] bg-[#f3f1eb] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#737069]">
            <AutoAwesomeOutlinedIcon fontSize="small" /> Your thinking partner
          </div>
          <h1 className="max-w-[680px] font-display text-6xl font-bold leading-[.95] tracking-[-0.07em] text-[#292929] sm:text-8xl">
            Make room for <span className="font-script text-7xl font-normal text-[#8a8880] sm:text-9xl">better</span> ideas.
          </h1>
          <p className="mt-8 max-w-[510px] text-lg leading-8 text-[#6f6d68]" aria-live="polite">
            <span className="block animate-[greetingIn_.8s_ease-out_both]">{greetings[0]}</span>
            <span className="mt-1 block font-editorial text-xl text-[#8a8880] animate-[greetingIn_.8s_.15s_ease-out_both]">{greetings[1]}</span>
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-3 rounded-full bg-[#292929] px-6 py-4 text-sm font-bold text-white transition-transform hover:-translate-y-1"
            >
              Start Chat <ArrowForwardIcon fontSize="small" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center rounded-full border border-[#bdbab1] px-6 py-4 text-sm font-bold text-[#292929] transition-colors hover:bg-[#f5f3ed]"
            >
              About Ali.ai
            </Link>
          </div>
          <div
            className="mt-12 flex flex-wrap gap-6 text-sm font-semibold text-[#77746d]
          "
          >
            <span className="flex items-center gap-2">
              <CheckIcon fontSize="small" /> Fast responses
            </span>
            <span className="flex items-center gap-2">
              <CheckIcon fontSize="small" /> Private by design
            </span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[470px] animate-[rise_.9s_.1s_ease-out_both]">
          <div className="absolute -right-4 -top-10 h-40 w-40 rounded-full border border-[#c6c2b8]" />
          <div className="relative rounded-[32px] border border-[#d1cec5] bg-[#f7f6f2] p-4 shadow-[20px_24px_0_#d9d7d0]">
            <div className="flex items-center justify-between border-b border-[#dfddd6] px-3 pb-4">
              <div className="flex gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-[#d7d4cc]" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#d7d4cc]" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#d7d4cc]" />
              </div>
              <span className="text-xs font-semibold text-[#9a978f]">
                ALI.AI / CHAT
              </span>
            </div>
            <div className="flex min-h-[390px] flex-col justify-between px-3 py-8 sm:min-h-[440px]">
              <div>
                <p className="font-display text-3xl font-bold tracking-[-0.05em]">
                  Good morning, Ali.
                </p>
                <p className="mt-3 max-w-[270px] text-sm leading-6 text-[#8b8880]">
                  What would you like to make a little clearer today?
                </p>
              </div>
              <div className="space-y-3">
                <div className="ml-auto max-w-[240px] rounded-2xl rounded-br-md bg-[#292929] px-4 py-3 text-sm leading-6 text-white">
                  Help me shape an idea for my next project.
                </div>
                <div className="max-w-[280px] rounded-2xl rounded-bl-md border border-[#dfddd6] bg-white px-4 py-3 text-sm leading-6 text-[#6f6d68]">
                  Absolutely. Let’s find the sharpest version of it together.
                </div>
                <div className="mt-8 flex items-center justify-between rounded-2xl border border-[#dfddd6] bg-white px-4 py-3 text-sm text-[#aaa69d]">
                  <span>Ask anything...</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#292929] text-white">
                    <ArrowForwardIcon fontSize="small" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
