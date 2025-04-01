
import React from 'react';

interface EthLogoProps {
  className?: string;
  size?: number;
}

const EthLogo: React.FC<EthLogoProps> = ({ className, size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 256 417" 
      xmlns="http://www.w3.org/2000/svg" 
      preserveAspectRatio="xMidYMid" 
      className={className}
    >
      <path fill="#627EEA" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
      <path fill="#3C3C3B" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
      <path fill="#8A92B2" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" />
      <path fill="#8A92B2" d="M127.962 416.905v-104.72L0 236.585z" />
      <path fill="#4E5FB2" d="M127.961 287.958l127.96-75.637-127.96-58.162z" />
      <path fill="#3C3C3B" d="M0 212.32l127.96 75.638v-133.8z" />
    </svg>
  );
};

export default EthLogo;
