'use client';

import type React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  image,
  imageAlt,
}: AuthLayoutProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  // Floating hearts animation
  const floatingHearts = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    size: Math.random() * 16 + 8,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
  }));

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>

      {/* Floating hearts (visible only on light theme) */}
      {mounted && theme === 'light' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              className="absolute text-primary/20"
              initial={{ y: '110vh', x: `${heart.x}vw`, opacity: 0.3 }}
              animate={{
                y: '-10vh',
                opacity: [0.2, 0.5, 0.2],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: heart.duration,
                delay: heart.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
              }}
              style={{ fontSize: heart.size }}
            >
              <Heart fill="currentColor" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Image Section */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden md:flex md:w-1/2 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 z-10" />
        <Image
          src={image || '/placeholder.svg?height=1080&width=1080'}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-md text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mb-6 inline-flex"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" fill="white" />
              </div>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              Find Your Perfect Match
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              Join thousands of couples who found their soulmate through our
              platform
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Form Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col p-6 md:p-12 justify-center items-center bg-background relative"
      >
        {/* Decorative rings */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <h2 className="text-3xl font-bold">
                <span className="text-primary">Heart</span>Bridge
              </h2>
            </motion.div>
            {mounted && <ThemeToggle />}
          </div>

          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-card/50 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg border border-border/50"
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
