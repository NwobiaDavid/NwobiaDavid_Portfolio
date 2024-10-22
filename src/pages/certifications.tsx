
import { useDocumentTitle } from "usehooks-ts";
import { motion } from "framer-motion";
import { FlowAppButton } from "@/components/content/flow-app-button";
import { Contact, Folder, Expand } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Certifications() {
  useDocumentTitle("Nwobia David | Certificates");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  enum Category {
    WEBDEVELOPMENT,
    DATASCIENCE,
    OTHERS,
  }

  interface Certificate {
    title: string;
    image: string;
    link: string;
    category: Category;
  }

  const Certs: Certificate[] = [
    {
      title: "JavaScript (Intermediate) Certificate",
      link: "https://www.hackerrank.com/certificates/a26fd989b676",
      image: "/images/certs/JavaScript (Intermediate) Certificate.png",
      category: Category.WEBDEVELOPMENT
    },
    {
      title: "JavaScript (Basic) Certificate",
      link: "https://www.hackerrank.com/certificates/1ed1cb5ddcf3",
      image: "/images/certs/JavaScript (Basic) Certificate.png",
      category: Category.WEBDEVELOPMENT
    },
    {
      title: "Advanced Learning Algorithms",
      link: "https://coursera.org/verify/YUCH3EAAM63S",
      image: "/images/certs/Coursera cert 3.jpg",
      category: Category.DATASCIENCE
    },
    {
      title: "Python for Data Science, AI & Development",
      link: "https://coursera.org/verify/E28S3GM28MXA",
      image: "/images/certs/Coursera cert 2_page-0001.jpg",
      category: Category.DATASCIENCE
    },
    {
      title: "Prompt Engineering Course on Large Language Models(LLMs)",
      link: "#",
      image: "/images/certs/obs.png",
      category: Category.OTHERS
    },
    {
      title: "Machine Learning",
      link: "https://www.coursera.org/account/accomplishments/specialization/DG6UFVA4QPRJ",
      image: "/images/certs/Coursera cert 5.jpg",
      category: Category.DATASCIENCE
    },
    {
      title: "Supervised Machine Learning: Regression and Classification",
      link: "https://coursera.org/verify/LULZL2QEFZY4",
      image: "/images/certs/Coursera cert 1.png_page-0001.jpg",
      category: Category.DATASCIENCE
    },
    {
      title: "Unsupervised Learning, Recommenders, Reinforcement Learning",
      link: "https://www.coursera.org/account/accomplishments/verify/HB3XADKR5ZSA",
      image: "/images/certs/Coursera cert 6_page-0001.jpg",
      category: Category.DATASCIENCE
    },
  ]


  const webdevCerts = Certs.filter(
    (value) => value.category === Category.WEBDEVELOPMENT
  )
  const datasciCerts = Certs.filter(
    (value) => value.category === Category.DATASCIENCE
  )
  const otherCerts = Certs.filter(
    (value) => value.category === Category.OTHERS
  )



  return (
    <div className="p-5 h-screen overflow-auto w-screen md:w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="flex flex-col gap-6"
      >
        <div>
          <h4 className="scroll-m-20 p_style text-xl font-semibold tracking-tight mb-2">
            Web Development
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {webdevCerts.map((value, index) => (
              <div  className=" relative " key={index} >
                <div className="p-5 relative rounded-md shadow-lg bg-secondary flex justify-center items-center flex-col gap-2">
                  <div onClick={() => setSelectedImage(value.image)} className="absolute cursor-pointer top-[10px] border border-slate-800 p-1 hover:bg-slate-300 duration-200 opacity-50 hover:opacity-100 bg-slate-200 rounded-md right-[10px] ">
                    <Expand />
                  </div>
                  <div>
                    <img src={value.image} loading="lazy" alt={value.title} />
                  </div>
                  <Link target="_blank" to={value.link} className=" hover:underline hover:text-slate-500 duration-200  " >{value.title}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="scroll-m-20 p_style text-xl font-semibold tracking-tight mb-2">
            Data Science
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {datasciCerts.map((value, index) => (
              <div  key={index} >
                <div className="p-5 relative rounded-md shadow-lg bg-secondary flex justify-center items-center flex-col gap-2">
                <div onClick={() => setSelectedImage(value.image)} className="absolute top-[10px] border border-slate-800 cursor-pointer p-1 hover:bg-slate-300 duration-200 opacity-50 hover:opacity-100 bg-slate-200 rounded-md right-[10px] ">
                    <Expand />
                  </div>
                  <div>
                    <img loading="lazy" src={value.image} alt={value.title} />
                  </div>
                  <Link className=" hover:underline hover:text-slate-500 duration-200  " target="_blank" to={value.link} >{value.title}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="scroll-m-20 p_style text-xl font-semibold tracking-tight mb-2">
            Others
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherCerts.map((value, index) => (
              <div  key={index} >
                <div className="p-5 relative rounded-md shadow-lg bg-secondary flex justify-center items-center flex-col gap-2">
                <div onClick={() => setSelectedImage(value.image)} className="absolute top-[10px] border border-slate-800 cursor-pointer p-1 hover:bg-slate-300 duration-200 opacity-50 hover:opacity-100 bg-slate-200 rounded-md right-[10px] ">
                    <Expand />
                  </div>
                  <div>
                    <img src={value.image} loading="lazy" alt={value.title} />
                  </div>
                  <Link className=" hover:underline hover:text-slate-500 duration-200 " target="_blank" to={value.link} >{value.title}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </motion.div>


      {selectedImage && (
        <motion.div
          className="fixed inset-0 p-5 bg-black bg-opacity-75 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.img
            src={selectedImage}
            className="max-w-full max-h-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          />
        </motion.div>
      )}


      <FlowAppButton
        containerClassName="pt-5"
        leftTitle="Skills"
        leftDescription="see what I'm working on"
        leftIcon={<Folder />}
        leftRoute="/skills"
        rightTitle="Say Hi👋"
        rightDescription="reach out tome through this channels"
        rightIcon={<Contact />}

      />
    </div>
  );
}
