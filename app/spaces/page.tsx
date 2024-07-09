// app/spaces/page.tsx

import Navbar from "@/components/EverythingComponents/Navbar";

const Spaces = () => {
  return (
    <div className="bg-[#14161e]  min-h-screen px-[80px] ">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Spaces</h1>
        {/* Add your Spaces content here */}
        <p className="text-[#748297]">This is the Spaces page content.</p>
      </main>
    </div>
  );
};
export default Spaces;
