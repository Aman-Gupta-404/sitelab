import { Button } from "../ui/button";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-[#0B0F1A]/80 backdrop-blur">
      <h1 className="text-lg sm:text-xl font-bold">BoltClone</h1>

      <div className="hidden md:flex gap-6 text-white/80">
        <a href="#features" className="text-sm hover:text-white">
          Features
        </a>
        <a href="#contact" className="text-sm hover:text-white">
          Contact
        </a>
      </div>

      <div className="flex gap-2 sm:gap-3">
        <Button
          size="sm"
          variant="outline"
          className="border-white/20 text-white hover:bg-white/5"
        >
          Login
        </Button>
        <Button
          size="sm"
          className="bg-[#7C5CFF] hover:bg-[#9B85FF] text-white"
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
