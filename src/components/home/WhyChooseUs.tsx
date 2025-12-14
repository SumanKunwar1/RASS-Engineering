import { motion } from 'framer-motion';
import { 
  Clock, 
  Cpu, 
  Users, 
  Award, 
  Wrench,
  CheckCircle2
} from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: '31+ Years Experience',
    description: 'Three decades of proven expertise in specialized construction and engineering solutions.',
  },
  {
    icon: Cpu,
    title: 'Advanced Technologies',
    description: 'Utilizing cutting-edge materials and techniques for superior, long-lasting results.',
  },
  {
    icon: Users,
    title: 'Tailored Solutions',
    description: 'Customized approaches designed to meet your specific project requirements.',
  },
  {
    icon: Award,
    title: 'Quality Commitment',
    description: 'Uncompromising quality standards with ISO-certified processes and materials.',
  },
  {
    icon: Wrench,
    title: 'End-to-End Services',
    description: 'Complete project management from consultation to final inspection.',
  },
  {
    icon: CheckCircle2,
    title: 'Guaranteed Results',
    description: 'Comprehensive warranties and post-project support for peace of mind.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 leading-tight">
              Engineering Excellence
              <span className="text-primary block">You Can Trust</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              At RASS Engineering, we combine decades of experience with innovative solutions 
              to deliver construction projects that exceed expectations. Our commitment to 
              quality and client satisfaction sets us apart in Nepal's construction industry.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-2xl bg-muted">
                <div className="text-3xl font-heading font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground mt-1">Projects</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-muted">
                <div className="text-3xl font-heading font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground mt-1">Clients</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-muted">
                <div className="text-3xl font-heading font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
              </div>
            </div>
          </motion.div>

          {/* Right - Features grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 gap-5"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group p-5 rounded-2xl bg-muted/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="text-primary group-hover:text-primary-foreground transition-colors" size={24} />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
