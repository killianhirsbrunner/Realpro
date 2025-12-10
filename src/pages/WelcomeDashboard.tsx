import { motion } from 'framer-motion';
import { Plus, Mail, Building2, Rocket, FolderPlus, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';

export function WelcomeDashboard() {
  const { user } = useCurrentUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full"
      >
        {/* Titre */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4"
          >
            Bienvenue sur RealPro
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-neutral-600 dark:text-neutral-400"
          >
            La plateforme de gestion immobilière professionnelle
          </motion.p>
        </motion.div>

        {/* Message personnalisé */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-brand-50 to-primary-50 dark:from-brand-950/50 dark:to-primary-950/50 rounded-2xl p-6 mb-12 border border-brand-200 dark:border-brand-800"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-100 dark:bg-brand-900/50 rounded-xl">
              <Rocket className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Commencez votre projet
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300">
                Vous n'avez pas encore de projet. Créez votre premier projet immobilier ou rejoignez un projet existant pour commencer.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Créer un projet */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
          >
            <Link
              to="/projects/wizard"
              className="block h-full"
            >
              <div className="h-full bg-white dark:bg-neutral-900 rounded-2xl p-8 border-2 border-neutral-200 dark:border-neutral-800 hover:border-brand-500 dark:hover:border-brand-500 transition-all duration-300">
                <div className="flex flex-col h-full">
                  <div className="p-4 bg-gradient-to-br from-brand-500 to-primary-500 rounded-xl w-fit mb-6">
                    <FolderPlus className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                    Créer un projet
                  </h3>

                  <p className="text-neutral-600 dark:text-neutral-400 mb-6 flex-grow">
                    Lancez un nouveau projet immobilier avec notre assistant de configuration. Définissez la structure, les lots, et commencez à gérer vos ventes.
                  </p>

                  <div className="flex items-center text-brand-600 dark:text-brand-400 font-semibold group">
                    <span>Démarrer maintenant</span>
                    <Plus className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* En attente d'invitation */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="h-full bg-white dark:bg-neutral-900 rounded-2xl p-8 border-2 border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-col h-full">
                <div className="p-4 bg-gradient-to-br from-neutral-400 to-neutral-500 rounded-xl w-fit mb-6">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                  Rejoindre un projet
                </h3>

                <p className="text-neutral-600 dark:text-neutral-400 mb-6 flex-grow">
                  Vous avez été invité à rejoindre un projet ? Vérifiez vos emails pour accepter l'invitation et accéder au projet.
                </p>

                <div className="flex items-center text-neutral-500 dark:text-neutral-400 font-medium">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>Vérifier vos invitations</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Preview */}
        <motion.div
          variants={itemVariants}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Gestion des lots', icon: Building2 },
            { label: 'CRM & Ventes', icon: UserPlus },
            { label: 'Finances & CFC', icon: Building2 },
            { label: 'Suivi chantier', icon: Rocket },
          ].map((feature, idx) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className="bg-neutral-50 dark:bg-neutral-900/50 rounded-xl p-4 text-center border border-neutral-200 dark:border-neutral-800"
            >
              <feature.icon className="w-6 h-6 text-brand-600 dark:text-brand-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {feature.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Help Text */}
        <motion.div
          variants={itemVariants}
          className="mt-12 text-center"
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Besoin d'aide pour démarrer ?
            <Link
              to="/help"
              className="ml-1 text-brand-600 dark:text-brand-400 hover:underline font-medium"
            >
              Consultez notre guide
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
