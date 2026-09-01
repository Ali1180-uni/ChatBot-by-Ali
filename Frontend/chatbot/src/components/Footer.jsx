import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function Footer() {
  return (
    <footer className="border-t border-[#d7d5cf] bg-[#e9e8e4]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-5 py-7 text-sm text-[#7d7b76] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Ali.ai. Thoughtful AI, made useful.</p>
        <div className="flex items-center gap-4">
          <a
            href="mailto:ali.stu.1180@gmail.com"
            aria-label="Email Ali.ai"
            className="transition-colors hover:text-[#292929]"
          >
            <EmailOutlinedIcon fontSize="small" />
          </a>
          <a
            href="https://github.com/Ali1180-uni"
            aria-label="GitHub"
            className="transition-colors hover:text-[#292929]"
          >
            <GitHubIcon fontSize="small" />
          </a>
          <a
            href="https://www.linkedin.com/in/hiali1180/"
            aria-label="LinkedIn"
            className="transition-colors hover:text-[#292929]"
          >
            <LinkedInIcon fontSize="small" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
