import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  highlight: string;
  subtitle: string;
}

const PageHeader = ({ title, highlight, subtitle }: PageHeaderProps) => (
  <div className="hero-gradient-bg py-16 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
        className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight"
      >
        {title} <span className="text-primary">{highlight}</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0, 0, 1] }}
        className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    </div>
  </div>
);

export default PageHeader;
