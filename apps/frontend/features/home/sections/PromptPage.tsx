import Image from "next/image";
import { ProjectForm } from "../components/ProjectForm";

function PromptPage() {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full mt-15">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image
            src={"logo.svg"}
            alt="logo"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>

        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Build with Sitelab
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
          create websites by chatting with AI
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>

      {/* <section className="min-h-screen bg-[#0B0F1A] text-[#E8ECF4] relative overflow-hidden"> */}
      {/* Background elements */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] left-[-80px] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-[#7C5CFF]/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-100px] right-[-80px] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-[#38D0FF]/10 blur-[100px] rounded-full" />
      </div> */}
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Hero Section */}
      {/* <Hero /> */}

      {/* Features Section */}
      {/* <section
        id="features"
        className="px-4 sm:px-6 py-16 sm:py-20 bg-[#141A2A]"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              title: "Instant Code Generation",
              desc: "Generate full applications from a single prompt.",
            },
            {
              title: "Live Preview",
              desc: "See your app running instantly in the browser.",
            },
            {
              title: "Edit & Iterate",
              desc: "Refine your app with follow-up prompts.",
            },
          ].map((feature, i) => (
            <Card key={i} className="bg-[#0B0F1A] border border-white/10">
              <CardContent className="p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/60">
                  {feature.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}

      {/* How it works */}
      {/* <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
          {["Enter your idea", "AI generates the app", "Run and iterate"].map(
            (step, i) => (
              <Card key={i} className="bg-[#141A2A] border border-white/10">
                <CardContent className="p-5 sm:p-6 text-center">
                  <div className="text-xl sm:text-2xl font-bold mb-2 text-[#7C5CFF]">
                    {i + 1}
                  </div>
                  <p className="text-sm sm:text-base text-white/80">{step}</p>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      </section> */}

      {/* Contact */}
      {/* <section
        id="contact"
        className="px-4 sm:px-6 py-16 sm:py-20 bg-[#141A2A]"
      >
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            Contact Us
          </h2>

          <div className="flex flex-col gap-3 sm:gap-4">
            <Input
              className="bg-[#0B0F1A] border border-white/10 text-sm sm:text-base"
              placeholder="Your Name"
            />
            <Input
              className="bg-[#0B0F1A] border border-white/10 text-sm sm:text-base"
              placeholder="Your Email"
            />
            <Textarea
              className="bg-[#0B0F1A] border border-white/10 text-sm sm:text-base"
              placeholder="Your Message"
            />
            <Button className="bg-[#7C5CFF] hover:bg-[#9B85FF] text-white text-sm sm:text-base">
              Send Message
            </Button>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      {/* <footer className="border-t border-white/10 px-4 sm:px-6 py-6 text-center text-xs sm:text-sm text-white/50">
        © {new Date().getFullYear()} BoltClone. All rights reserved.
      </footer> */}
    </div>
  );
}

export default PromptPage;
