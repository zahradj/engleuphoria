import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Linkedin, Twitter } from 'lucide-react';

const teamMembers = [
  {
    name: 'Sarah Chen',
    role: 'Founder & CEO',
    bio: 'Former Cambridge professor with 15 years in ESL education.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    name: 'Marcus Johnson',
    role: 'Head of Curriculum',
    bio: 'Designed curricula for 50,000+ students globally.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Lead Teacher Trainer',
    bio: 'CELTA certified with expertise in young learners.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    name: 'David Park',
    role: 'Technology Director',
    bio: 'Building the future of interactive learning.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    gradient: 'from-blue-500 to-cyan-600'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const TeamGrid = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            Meet the Visionaries
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Passionate educators and innovators dedicated to transforming English learning worldwide.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
            >
              <GlassCard className="p-6 text-center group hover:scale-105 transition-transform duration-300">
                {/* Photo */}
                <div className="relative mx-auto w-28 h-28 mb-4">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} blur-lg opacity-50 group-hover:opacity-70 transition-opacity`} />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative w-28 h-28 rounded-full object-cover border-4 border-white/10"
                  />
                </div>

                {/* Role Badge */}
                <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${member.gradient} mb-3`}>
                  <span className="text-white text-xs font-semibold">{member.role}</span>
                </div>

                {/* Name */}
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  {member.name}
                </h3>

                {/* Bio */}
                <p className="text-white/60 text-sm mb-4">
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    <Linkedin className="w-4 h-4 text-white/60" />
                  </button>
                  <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    <Twitter className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamGrid;
