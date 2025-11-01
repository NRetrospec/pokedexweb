import { motion } from "framer-motion";
import { getTypeColor } from "../utils/typeColors";

interface TypeChartProps {
  data: Array<{ type: string; count: number }>;
}

export function TypeChart({ data }: TypeChartProps) {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Type Distribution
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.map((item, index) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="relative mb-2">
              <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <motion.div
                  className={`${getTypeColor(item.type)} w-full rounded-lg flex items-end justify-center pb-2`}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.count / maxCount) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <span className="text-white font-bold text-sm">{item.count}</span>
                </motion.div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.type}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
