import { Head } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";
import { Footer } from "./Footer.tsx";
import { CSS, KATEX_CSS } from "https://deno.land/x/gfm@0.2.1/mod.ts";

export function Page({ children }: { children: ComponentChildren }) {
  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <style dangerouslySetInnerHTML={{ __html: KATEX_CSS }} />
      </Head>
      <img
        src="/background.png"
        alt="bg"
        class="absolute top-0 left-0 w-full min-h-screen -z-10 overflow-hidden"
      />
      <div class="flex flex-col justify-center items-center w-full h-screen children:(bg-[#FFF] border-1 border-gray-300)">
        {children}
        <Footer />
      </div>
    </>
  );
}
