import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2 } from 'lucide-react';

interface AdminDeleteModalProps {
  projectToDelete: any;
  setProjectToDelete: (proj: any) => void;
  confirmDeleteProject: () => void;
}

export default function AdminDeleteModal({
  projectToDelete,
  setProjectToDelete,
  confirmDeleteProject
}: AdminDeleteModalProps) {
  return (
    <AnimatePresence>
      {projectToDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-navy-dark/95 backdrop-blur-[20px] flex items-center justify-center p-6"
          onClick={() => setProjectToDelete(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative max-w-sm w-full glass-panel p-8 text-center rounded-none border border-white/20 shadow-[0_24px_64px_rgba(0,0,0,0.8)] space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-950/40 border border-red-500 text-red-400 flex items-center justify-center mx-auto animate-pulse">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider mb-2">
                Confirm Disposal
              </h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Are you sure you want to delete this project? This operation is irreversible and will remove the item from public display immediately.
              </p>
              <div className="w-16 h-px bg-white/10 mx-auto mt-4" />
              <span className="block mt-2 font-mono text-[10px] text-gold uppercase truncate max-w-full px-4 font-bold">
                {projectToDelete.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="w-full py-3.5 border border-white/15 bg-white/5 text-white text-xs uppercase tracking-wider hover:border-white/30 transition-all duration-300"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteProject}
                className="w-full py-3.5 bg-red-600 border border-red-500 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_4px_15px_rgba(239,68,68,0.3)]"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
