import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import { insertText } from "../taskpane";
import { nanoid } from "nanoid";

interface Paper {
  title: string;
  authors: string[];
  year: number;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    padding: "20px",
  },
  searchContainer: {
    marginBottom: "20px",
  },
  result: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
});

const App = () => {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [foundPapers, setFoundPapers] = useState<Paper[] | null>(null);
  const [papers] = useState<Paper[]>([
    {
      title: "Efficient algorithm for initializing amplitude distribution of a quantum register",
      authors: ["M. Andrecut", "M. K. Ali"],
      year: 2001,
    },
    {
      title: "Variational Quantum Simulation of Lindblad Dynamics via Quantum State Diffusion.",
      authors: ["Jianming Luo", "Kaihan Lin", "Xing Gao"],
      year: 2024,
    },
    {
      title: "Jumptime unraveling of Markovian open quantum systems",
      authors: ["C. Gneiting", "A. Rozhkov", "F. Nori"],
      year: 2020,
    },
  ]);

  const handleSearch = () => {
    const results = papers.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFoundPapers(results || null);
  };

  return (
    <div className={styles.root}>
      <div className={styles.searchContainer}>
        <h3>Discover</h3>
        <p>Search database</p>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {foundPapers?.map(paper => {
        return (
          <div className={styles.result} key={nanoid()}>
            <h3>{paper.title}</h3>
            <p>Authors: {`${paper.authors.join(", ")} • ${paper.year}`}</p>
            <button
              onClick={() => insertText(paper)}
            >
              Insert
            </button>
          </div>
        )
      })
      }

    </div>
  );
};

export default App;
