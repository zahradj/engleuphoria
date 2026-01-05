
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'gradient' | 'white';
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'large',
  variant = 'gradient',
  onClick,
  className = ''
}) => {
  const navigate = useNavigate();
  
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-4xl'
  };

  const variantClasses = {
    gradient: 'bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent',
    white: 'text-white'
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/');
    }
  };

  return (
    <div 
      onClick={handleClick} 
      className={`cursor-pointer transition-transform hover:scale-105 ${className}`}
    >
      <h1 className={`${sizeClasses[size]} font-bold ${variantClasses[variant]} tracking-tight hover:tracking-normal transition-all duration-300`}>
        Engleuphoria
      </h1>
    </div>
  );
};
