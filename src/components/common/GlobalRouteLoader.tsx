import Image from "next/image";

export default function GlobalLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Spinner */}
        <div className="absolute h-28 w-28 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />

        {/* Logo */}
        <Image
          src="/images/logo/mendel-logo.svg"
          alt="Loading"
          width={64}
          height={64}
          className="z-10"
        />
      </div>
    </div>
  );
}
