
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        <Hero />
        
        {/* Divider with logo */}
        <div className="relative py-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-t border-border w-full"></div>
          </div>
          <div className="relative flex justify-center">
            <motion.div 
              className="bg-background px-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-xl text-center text-muted-foreground font-medium max-w-xl">
                "La forma más sencilla para que las PYMEs gestionen sus citas y reduzcan las cancelaciones"
              </p>
            </motion.div>
          </div>
        </div>
        
        <Features />
        <Pricing />
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Listo para simplificar la gestión de citas?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 md:px-8">
                Únete a cientos de negocios que ya han aumentado sus ingresos y reducido las cancelaciones con AgendaFácil.
              </p>
              <motion.div 
                className="inline-flex"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="/register" 
                  className="rounded-lg px-6 py-3 bg-primary text-primary-foreground font-medium transition-all hover:bg-primary/90 shadow-sm"
                >
                  Comienza tu prueba gratuita
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
