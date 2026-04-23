'use client';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';

interface BackButtonProps {
  label?: string;
  href?: string;
}

const BackButton = ({ label, href }: BackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 group"
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-200 group-hover:bg-[#ffcb07] group-hover:border-[#ffcb07] transition-all duration-200">
        <IoArrowBack size={18} />
      </span>
      {label && (
        <span className="text-sm font-medium">{label}</span>
      )}
    </button>
  );
};

export default BackButton;
