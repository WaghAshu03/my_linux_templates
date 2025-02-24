#!/usr/bin/env node

// Helper function to parse arguments
function parseArguments(args) {
  const parsed = {
    from: null,
    subjects: [],
    showYears: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--from") {
      parsed.from = Number(args[++i]); // Get the next argument and convert to a number
    } else if (arg === "--to") {
      parsed.to = Number(args[++i]); // Get the next argument and convert to a number
    } else if (arg === "--year") {
      parsed.exactYear = Number(args[++i]); // Get the next argument and convert to a number
    } else if (arg === "--subjects") {
      // Collect subjects as an array of strings
      while (args[i + 1] && !args[i + 1].startsWith("--")) {
        parsed.subjects.push(args[++i]);
      }
    } else if (arg === "--showYears") {
      parsed.showYears = true; // Boolean flag, no additional value needed
    } else if (arg === "--onlyTotal") {
      parsed.onlyTotal = true; // Boolean flag, no additional value needed
    }
  }

  return parsed;
}

// Parse the arguments passed to the script
const args = process.argv.slice(2); // Ignore 'node' and script name
const parsedArgs = parseArguments(args);
let fromYears = parsedArgs.from == null ? 0 : parseInt(parsedArgs.from);
let toYears = parsedArgs.to == null ? 10000 : parseInt(parsedArgs.to);
let exactYear =
  parsedArgs.exactYear == null ? -1 : parseInt(parsedArgs.exactYear);
const inpSubCode = parsedArgs.subjects;
const showYears = Boolean(parsedArgs.showYears);
const onlyTotal = Boolean(parsedArgs.onlyTotal);

if (fromYears > toYears) {
  let temp = fromYears;
  fromYears = toYears;
  toYears = temp;
}
if (exactYear && exactYear >= 1950) {
  fromYears = toYears = exactYear;
}

const CN = {
  "Application Layer Protocol": [
    12, 2008, 2011, 2012, 2016, 2019, 2020, 2022, 2005, 2005, 2005, 2006, 2008,
  ],
  Bridges: [3, 2004, 2006, 2006],
  "CRC Polynomial": [4, 2007, 2017, 2021, 2005],
  "CSMA CD": [5, 2015, 2016, 2005, 2005, 2008],
  Communication: [4, 2012, 2022, 2007, 2007],
  "Congestion Control": [7, 2008, 2012, 2014, 2015, 2018, 2018, 2005],
  "Distance Vector Routing": [
    8, 2010, 2010, 2011, 2011, 2021, 2022, 2005, 2007,
  ],
  "Error Detection": [
    11, 1992, 1994, 1995, 2009, 2014, 2017, 2021, 2005, 2007, 2008, 1987,
  ],
  Ethernet: [7, 2004, 2013, 2016, 2022, 2024, 2024, 2006],
  "IP Addressing": [
    10, 2003, 2004, 2004, 2012, 2013, 2014, 2017, 2018, 2023, 2024,
  ],
  "IP Packet": [
    12, 2006, 2010, 2014, 2014, 2015, 2015, 2016, 2024, 2024, 2024, 2004, 2024,
  ],
  "LAN Technologies": [7, 2003, 2007, 2014, 2019, 2004, 2005, 2006],
  "MAC Protocol": [5, 2005, 2015, 2021, 2004, 2005],
  "Network Flow": [5, 1992, 2017, 2004, 2004, 2006],
  "Network Layering": [6, 2003, 2004, 2007, 2013, 2014, 2018],
  "Network Protocol": [
    10, 2005, 2007, 2015, 2016, 2019, 2021, 2021, 2024, 2007, 2008,
  ],
  "Network Switching": [4, 2005, 2014, 2015, 2004],
  Routing: [
    13, 2005, 2014, 2014, 2014, 2017, 2020, 2023, 2024, 2024, 2005, 2005, 2007,
    2008,
  ],
  "Sliding Window": [
    15, 2003, 2005, 2006, 2006, 2007, 2009, 2009, 2014, 2015, 2016, 2004, 2004,
    2004, 2006, 2008,
  ],
  Socket: [4, 2008, 2008, 2014, 2015],
  "Stop & Wait": [6, 2015, 2016, 2017, 2023, 2005, 2006],
  Subnetting: [
    20, 2003, 2004, 2005, 2006, 2007, 2008, 2010, 2012, 2015, 2015, 2019, 2020,
    2022, 2023, 2004, 2005, 2006, 2006, 2008, 2008,
  ],
  TCP: [
    21, 2009, 2012, 2015, 2015, 2015, 2016, 2017, 2018, 2020, 2021, 2021, 2021,
    2022, 2023, 2024, 2024, 2004, 2004, 2007, 2007, 2008,
  ],
  "Token Bucket": [2, 2008, 2016],
  UDP: [3, 2005, 2013, 2017],
};

const C = {
  Aliasing: [1, 2000],
  Array: [
    13, 2011, 2015, 2015, 2015, 2017, 2019, 2020, 2021, 2022, 2004, 2008, 2008,
    2008,
  ],
  Functions: [1, 2024],
  Goto: [2, 1989, 1994],
  "Identity Function": [6, 1995, 1998, 2017, 2017, 2019, 2004],
  "Loop Invariants": [8, 1987, 1988, 1988, 1991, 2004, 2015, 2016, 2017],
  Output: [5, 2022, 2023, 2024, 2024, 2024],
  "Parameter Passing": [
    12, 1992, 1994, 2001, 2003, 2008, 2010, 2013, 2016, 2016, 2018, 2006, 2008,
  ],
  Pointers: [
    11, 2000, 2001, 2003, 2003, 2005, 2006, 2014, 2015, 2017, 2022, 2024,
  ],
  "Programming Constructs": [1, 1999],
  "Programming in C": [
    31, 2000, 2002, 2002, 2002, 2004, 2005, 2008, 2008, 2012, 2012, 2014, 2014,
    2015, 2015, 2016, 2016, 2017, 2017, 2017, 2017, 2018, 2019, 2019, 2019,
    2021, 2024, 2004, 2004, 2005, 2006, 2007,
  ],
  "Programming Paradigms": [2, 2004, 2004],
  Recursion: [
    17, 1991, 1994, 2000, 2001, 2002, 2004, 2005, 2007, 2014, 2015, 2016, 2016,
    2017, 2017, 2018, 2020, 2007,
  ],
  Structure: [5, 2000, 2018, 2021, 2004, 2006],
  "Switch Case": [2, 2012, 2015],
  "Type Checking": [1, 2003],
  Union: [1, 2000],
  "Variable Binding": [1, 2007],
};

const DS = {
  "AVL Tree": [4, 1988, 2009, 2020, 2008],
  Array: [
    13, 1993, 1994, 1994, 1997, 1998, 2000, 2000, 2005, 2013, 2013, 2014, 2015,
    2021,
  ],
  "Binary Heap": [
    29, 1990, 1996, 1999, 2001, 2003, 2004, 2005, 2006, 2006, 2006, 2007, 2009,
    2009, 2011, 2014, 2015, 2015, 2015, 2016, 2016, 2018, 2019, 2020, 2021,
    2023, 2024, 2004, 2006, 2006,
  ],
  "Binary Search Tree": [
    34, 1996, 1996, 1997, 2001, 2003, 2003, 2003, 2004, 2004, 2005, 2005, 2008,
    2012, 2013, 2013, 2014, 2015, 2015, 2015, 2016, 2017, 2017, 2020, 2020,
    2021, 2022, 2024, 2005, 2005, 2006, 2007, 2008, 2008, 2008,
  ],
  "Binary Tree": [
    53, 1987, 1987, 1987, 1988, 1988, 1989, 1990, 1991, 1991, 1991, 1991, 1991,
    1993, 1994, 1995, 1995, 1996, 1996, 1997, 1998, 2000, 2000, 2002, 2002,
    2004, 2004, 2006, 2007, 2007, 2007, 2007, 2010, 2011, 2012, 2014, 2015,
    2015, 2015, 2016, 2018, 2019, 2021, 2023, 2024, 2024, 2004, 2005, 2006,
    2006, 2006, 2008, 2008, 2008,
  ],
  "Data Structure": [6, 1997, 2005, 2014, 2016, 2024, 2024],
  Hashing: [
    16, 1996, 1996, 1997, 2004, 2007, 2009, 2010, 2010, 2014, 2014, 2015, 2015,
    2024, 2006, 2007, 2008,
  ],
  "Infix Prefix": [5, 1989, 1997, 1998, 2004, 2007],
  "Linked List": [
    22, 1987, 1987, 1993, 1994, 1995, 1997, 1997, 1998, 1999, 2002, 2003, 2004,
    2004, 2008, 2010, 2016, 2017, 2020, 2022, 2023, 2004, 2005,
  ],
  "Priority Queue": [2, 1997, 2023],
  Queue: [
    13, 1992, 1994, 1996, 2001, 2006, 2012, 2013, 2016, 2016, 2017, 2018, 2022,
    2007,
  ],
  Stack: [
    16, 1991, 1994, 1995, 2000, 2003, 2004, 2004, 2014, 2015, 2015, 2021, 2023,
    2024, 2004, 2005, 2007,
  ],
  Tree: [
    14, 1990, 1992, 1994, 1998, 1998, 1998, 2002, 2004, 2005, 2007, 2014, 2014,
    2017, 2021,
  ],
};

const DL = {
  Adder: [9, 1988, 1990, 1997, 1999, 2003, 2004, 2015, 2016, 2016],
  "Array Multiplier": [2, 1999, 2003],
  "Boolean Algebra": [
    32, 1987, 1988, 1988, 1989, 1989, 1992, 1994, 1995, 1997, 1998, 1998, 1999,
    2000, 2002, 2004, 2007, 2007, 2008, 2012, 2013, 2014, 2014, 2015, 2016,
    2016, 2017, 2018, 2019, 2021, 2024, 2004, 2005,
  ],
  "Booths Algorithm": [6, 1990, 1996, 1999, 2005, 2006, 2008],
  "Canonical Normal Form": [
    9, 2002, 2007, 2008, 2010, 2015, 2015, 2019, 2020, 2024,
  ],
  "Carry Generator": [2, 2006, 2007],
  "Circuit Output": [
    39, 1987, 1989, 1990, 1991, 1993, 1993, 1993, 1993, 1994, 1994, 1996, 1996,
    1996, 1996, 1997, 1999, 2000, 2001, 2002, 2004, 2005, 2005, 2005, 2006,
    2006, 2006, 2007, 2010, 2010, 2010, 2011, 2011, 2014, 2005, 2005, 2006,
    2007, 2007, 2007,
  ],
  "Combinational Circuit": [2, 2022, 2024],
  Decoder: [3, 2007, 2020, 2008],
  "Digital Circuit": [6, 1996, 2002, 2003, 2011, 2013, 2014],
  "Digital Counter": [
    17, 1987, 1987, 1990, 1991, 1994, 2002, 2011, 2014, 2015, 2015, 2016, 2017,
    2021, 2023, 2005, 2008, 1992,
  ],
  "Finite State Machine": [4, 1994, 1995, 1996, 2009],
  "Fixed Point Representation": [2, 2017, 2018],
  "Flip Flop": [6, 2001, 2004, 2015, 2017, 2018, 2007],
  "Floating Point Representation": [
    8, 1987, 1989, 1990, 1990, 1997, 2003, 2005, 2005,
  ],
  "Functional Completeness": [7, 1989, 1992, 1993, 1998, 1999, 2015, 2008],
  "IEEE Representation": [
    11, 2008, 2012, 2014, 2017, 2020, 2021, 2021, 2022, 2023, 2024, 2008,
  ],
  "K Map": [
    19, 1987, 1988, 1992, 1995, 1995, 1996, 1998, 1999, 2000, 2001, 2002, 2003,
    2008, 2012, 2017, 2019, 2006, 2007, 2007,
  ],
  "Memory Interfacing": [4, 1995, 2009, 2010, 2005],
  "Min No. Gate": [4, 2000, 2004, 2009, 2004],
  "Min Product of Sum": [2, 1990, 2017],
  "Min Sum of Product Form": [
    14, 1988, 1991, 1997, 2001, 2005, 2007, 2011, 2014, 2014, 2014, 2018, 2021,
    2024, 2008,
  ],
  Multiplexer: [
    14, 1990, 1998, 2001, 2004, 2007, 2016, 2020, 2021, 2023, 2023, 2024, 2005,
    2007, 1992,
  ],
  "Number Representation": [
    57, 1988, 1990, 1991, 1991, 1992, 1993, 1994, 1995, 1995, 1996, 1997, 1998,
    1998, 1999, 2000, 2000, 2001, 2002, 2002, 2002, 2002, 2002, 2003, 2004,
    2004, 2004, 2005, 2005, 2006, 2006, 2008, 2009, 2010, 2013, 2014, 2014,
    2015, 2016, 2016, 2017, 2017, 2019, 2019, 2019, 2021, 2021, 2021, 2022,
    2023, 2024, 2024, 2024, 2004, 2005, 2006, 2007, 2008,
  ],
  "Prime Implicant": [2, 1997, 2004],
  ROM: [4, 1993, 1996, 2012, 2004],
  "Shift Registers": [2, 1987, 1991],
  "Static Hasard": [1, 2006],
  "Synchronous Asynchronous Circuit": [4, 1991, 1993, 2001, 2003],
};

const TOC = {
  "Closure Property": [8, 1989, 1992, 2002, 2013, 2016, 2017, 2018, 2006],
  "Context Free Language": [
    32, 1987, 1992, 1995, 1996, 1996, 1999, 1999, 2000, 2001, 2003, 2005, 2006,
    2009, 2015, 2016, 2016, 2016, 2017, 2017, 2017, 2017, 2019, 2021, 2021,
    2022, 2023, 2006, 2006, 2007, 2007, 2007, 2008,
  ],
  "Countable Uncountable Set": [3, 1997, 2014, 2019],
  Decidability: [
    29, 1987, 1987, 1988, 1989, 1990, 1995, 1996, 1997, 1999, 2000, 2001, 2001,
    2002, 2003, 2003, 2007, 2008, 2012, 2013, 2014, 2015, 2015, 2016, 2017,
    2017, 2018, 2020, 2021, 2022,
  ],
  "Finite Automata": [
    41, 1988, 1991, 1993, 1996, 1997, 1998, 2001, 2002, 2002, 2003, 2003, 2004,
    2005, 2005, 2007, 2008, 2008, 2009, 2012, 2012, 2013, 2014, 2016, 2017,
    2021, 2021, 2021, 2024, 2024, 2024, 2004, 2005, 2005, 2006, 2006, 2007,
    2007, 2007, 2007, 2008, 2008,
  ],
  "Identify Class Language": [
    31, 1987, 1988, 1991, 1994, 1999, 2000, 2002, 2004, 2005, 2006, 2006, 2007,
    2008, 2008, 2009, 2010, 2011, 2013, 2014, 2017, 2017, 2018, 2020, 2020,
    2021, 2022, 2022, 2023, 2005, 2005, 2008,
  ],
  "Minimal State Automata": [
    25, 1987, 1997, 1997, 1998, 1998, 1999, 2001, 2001, 2002, 2006, 2007, 2007,
    2010, 2011, 2011, 2015, 2015, 2015, 2016, 2017, 2017, 2018, 2019, 2023,
    2008,
  ],
  "Non Determinism": [6, 1992, 1994, 1998, 2005, 2011, 2004],
  "Pumping Lemma": [2, 2019, 2005],
  "Pushdown Automata": [
    15, 1996, 1997, 1998, 1999, 2000, 2001, 2009, 2015, 2016, 2021, 2023, 2004,
    2005, 2006, 2006,
  ],
  "Recursive and Recursively Enumerable Languages": [
    16, 1990, 2003, 2003, 2003, 2004, 2005, 2008, 2008, 2010, 2014, 2014, 2014,
    2015, 2016, 2021, 2021,
  ],
  Reduction: [2, 2005, 2016],
  "Regular Expression": [
    29, 1987, 1991, 1992, 1994, 1995, 1996, 1997, 1998, 1998, 1998, 2000, 2003,
    2009, 2010, 2014, 2014, 2016, 2020, 2021, 2022, 2023, 2023, 2024, 2024,
    2004, 2005, 2006, 2007, 2008,
  ],
  "Regular Grammer": [3, 1990, 2015, 2006],
  "Regular Language": [
    33, 1987, 1987, 1990, 1991, 1995, 1996, 1998, 1999, 2000, 2001, 2001, 2006,
    2007, 2007, 2008, 2011, 2012, 2013, 2014, 2014, 2014, 2015, 2016, 2018,
    2019, 2020, 2020, 2021, 2024, 2006, 2006, 2006, 2008,
  ],
};

const CD = {
  Assembler: [9, 1992, 1992, 1992, 1993, 1994, 1994, 1994, 1994, 1996],
  "Code Optimization": [
    9, 2006, 2006, 2008, 2014, 2014, 2014, 2015, 2021, 2021,
  ],
  "Compilation Phases": [
    12, 1987, 1990, 2005, 2009, 2015, 2016, 2017, 2018, 2020, 2021, 2023, 2024,
  ],
  "Expression Evaluation": [2, 2002, 2014],
  "First and Follow": [5, 1992, 2012, 2017, 2019, 2024],
  Grammer: [
    50, 1988, 1988, 1990, 1991, 1991, 1991, 1992, 1994, 1994, 1994, 1995, 1995,
    1996, 1996, 1997, 1997, 1998, 1998, 1991, 2001, 2001, 2003, 2003, 2003,
    2004, 2004, 2004, 2005, 2005, 2006, 2006, 2006, 2006, 2007, 2007, 2007,
    2007, 2008, 2010, 2014, 2016, 2016, 2017, 2019, 2021, 2024, 2024, 2005,
    2007, 2008,
  ],
  "Intermediate Code": [
    11, 1988, 1989, 1992, 1994, 2014, 2014, 2015, 2015, 2021, 2024, 2024,
  ],
  "LR Parser": [
    19, 1992, 1998, 2003, 2005, 2006, 2008, 2013, 2013, 2014, 2014, 2015, 2017,
    2019, 2020, 2021, 2021, 2022, 2022, 2024,
  ],
  "Lexical Analysis": [6, 1987, 2000, 2010, 2011, 2011, 2018],
  Linker: [3, 1991, 2003, 2004],
  "Live Variable Analysis": [3, 2015, 2021, 2023],
  Macros: [4, 1992, 1995, 1996, 1997],
  "Operator Precedence": [3, 2000, 2016, 2024],
  "Parameter Passing": [
    14, 1988, 1988, 1989, 1990, 1991, 1991, 1991, 1993, 1995, 1999, 2003, 2004,
    2016, 2007,
  ],
  Parsing: [
    27, 1987, 1987, 1989, 1993, 1995, 1998, 1998, 1999, 2000, 2001, 2002, 2003,
    2005, 2005, 2006, 2007, 2008, 2009, 2011, 2012, 2015, 2017, 2018, 2024,
    2024, 2005, 2008,
  ],
  "Register Allocation": [6, 1997, 2004, 2010, 2011, 2013, 2017],
  "Runtime Envirment": [
    22, 1988, 1989, 1989, 1990, 1990, 1993, 1995, 1996, 1997, 1997, 1998, 1998,
    1998, 2001, 2002, 2008, 2010, 2012, 2014, 2014, 2021, 2023,
  ],
  "Static Single Assignment": [3, 2015, 2016, 2017],
  "Syntax Directed Trasnlation": [
    16, 1992, 1995, 1995, 1998, 2000, 2001, 2003, 2003, 2016, 2019, 2020, 2021,
    2022, 2023, 2024, 2024,
  ],
  "Variable Scope": [2, 1987, 1987],
};

const Algo = {
  "Algorithm Design": [8, 1992, 1994, 2006, 2006, 2014, 2019, 2021, 2024],
  "Algorithm Design Technique": [
    9, 1990, 1990, 1994, 1995, 1997, 1998, 2015, 2015, 2017,
  ],
  "Asymptotic Notation": [
    21, 1994, 1996, 1999, 2000, 2001, 2003, 2004, 2005, 2008, 2011, 2012, 2015,
    2015, 2017, 2021, 2022, 2023, 2023, 2024, 2004, 2008,
  ],
  "Bellman Ford": [2, 2009, 2013],
  "Binary Search": [2, 2021, 2024],
  "Dijikstras Algorithm": [6, 1996, 2004, 2005, 2006, 2008, 2012],
  "Dynamic Programming": [
    9, 2008, 2008, 2009, 2009, 2010, 2011, 2014, 2014, 2016,
  ],
  "Graph Algorithm": [
    11, 1994, 2003, 2005, 2005, 2016, 2017, 2021, 2021, 2005, 2005, 2005,
  ],
  "Graph Search": [
    22, 1989, 2000, 2000, 2001, 2003, 2006, 2008, 2014, 2014, 2014, 2015, 2016,
    2017, 2018, 2023, 2024, 2024, 2024, 2005, 2006, 2007, 2008,
  ],
  "Greedy Algorithm": [5, 1999, 2003, 2005, 2005, 2018],
  Hashing: [7, 1989, 1990, 2020, 2021, 2022, 2023, 2005],
  "Huffman Code": [6, 1989, 2007, 2007, 2017, 2021, 2006],
  "Identify Function": [
    38, 1989, 1990, 1991, 1993, 1994, 1995, 1995, 1995, 1998, 1999, 2000, 2003,
    2003, 2004, 2004, 2005, 2006, 2006, 2009, 2010, 2011, 2011, 2013, 2014,
    2014, 2014, 2015, 2015, 2015, 2019, 2020, 2021, 2021, 2005, 2005, 2006,
    2008, 2008,
  ],
  "Insertion Sort": [2, 2003, 2003],
  "Matrix Chain Ordering": [3, 2011, 2016, 2018],
  "Merge Sort": [3, 1999, 2012, 2015],
  Merging: [2, 1995, 2014],
  "Minimum Spanning Tree": [
    33, 1991, 1992, 1995, 1996, 1997, 2000, 2001, 2003, 2005, 2006, 2006, 2007,
    2009, 2010, 2010, 2011, 2011, 2012, 2014, 2015, 2015, 2016, 2016, 2016,
    2018, 2020, 2020, 2021, 2021, 2022, 2022, 2024, 2005,
  ],
  "Prims Algorithm": [2, 2004, 2008],
  "Quick Sort Algorithm": [
    14, 1987, 1989, 1992, 1996, 2001, 2006, 2008, 2009, 2014, 2014, 2015, 2015,
    2019, 2024,
  ],
  "Recurrance Relation": [
    34, 1987, 1988, 1989, 1990, 1992, 1992, 1993, 1994, 1996, 1997, 1997, 1998,
    2002, 2002, 2003, 2004, 2004, 2006, 2008, 2008, 2009, 2012, 2014, 2015,
    2015, 2016, 2017, 2020, 2021, 2021, 2024, 2004, 2005, 2008,
  ],
  Recursion: [4, 1995, 2007, 2018, 2021],
  Searching: [6, 1996, 1996, 2002, 2008, 2008, 2017],
  "Shortest Path": [5, 2002, 2003, 2007, 2020, 2007],
  Sorting: [
    27, 1988, 1990, 1991, 1991, 1992, 1995, 1996, 1998, 1999, 1999, 2000, 2003,
    2005, 2006, 2007, 2009, 2013, 2013, 2014, 2016, 2016, 2021, 2024, 2024,
    2024, 2005, 2008,
  ],
  "Space Complexity": [1, 2005],
  "Strongly Connnected Components": [3, 2008, 2018, 2006],
  "Time Complexity": [
    29, 1988, 1989, 1993, 1999, 1999, 1999, 2000, 2003, 2004, 2004, 2006, 2007,
    2007, 2007, 2007, 2008, 2008, 2008, 2008, 2010, 2014, 2015, 2015, 2017,
    2017, 2019, 2024, 2007, 2007,
  ],
  "Topological Sort": [4, 2007, 2014, 2016, 2024],
};

const DBMS = {
  "B Tree": [
    29, 1989, 1994, 1994, 1997, 1999, 1999, 2000, 2000, 2001, 2002, 2002, 2003,
    2004, 2005, 2007, 2008, 2009, 2010, 2015, 2015, 2016, 2017, 2019, 2024,
    2004, 2005, 2006, 2007, 2007,
  ],
  "Candidate Key": [5, 1994, 2011, 2014, 2014, 2014],
  "Conflict Serializable": [8, 2014, 2014, 2014, 2017, 2021, 2021, 2022, 2024],
  "Database Design": [1, 1994],
  "Database Normalization": [
    55, 1987, 1988, 1988, 1988, 1988, 1990, 1990, 1994, 1995, 1997, 1998, 1996,
    1999, 1999, 2000, 2001, 2002, 2002, 2002, 2002, 2003, 2004, 2005, 2005,
    2006, 2007, 2008, 2012, 2013, 2013, 2014, 2014, 2015, 2016, 2016, 2017,
    2018, 2019, 2020, 2021, 2021, 2022, 2022, 2024, 2024, 2024, 2024, 2024,
    2004, 2005, 2005, 2006, 2008, 2008, 2001,
  ],
  "ER Diagram": [
    12, 2005, 2008, 2008, 2012, 2015, 2017, 2018, 2020, 2024, 2024, 2004, 2005,
  ],
  Indexing: [
    13, 1989, 1990, 1993, 1998, 2008, 2008, 2011, 2013, 2015, 2020, 2021, 2023,
    2024,
  ],
  Joins: [7, 2004, 2012, 2014, 2005, 2005, 2006, 2007],
  "Multivalued Dependency 4nf": [1, 2007],
  "Natural Join": [3, 2005, 2010, 2015],
  "Refrential Integrity": [4, 1997, 2005, 2017, 2021],
  "Relational Algebra": [
    30, 1992, 1994, 1994, 1995, 1996, 1997, 1998, 1998, 1999, 2000, 2001, 2001,
    2002, 2003, 2004, 2007, 2008, 2012, 2014, 2014, 2015, 2017, 2018, 2019,
    2021, 2022, 2024, 2024, 2024, 2005,
  ],
  "Relational Calculus": [
    15, 1993, 1993, 1998, 1999, 2001, 2002, 2004, 2007, 2008, 2009, 2013, 2017,
    2006, 2007, 2008,
  ],
  "Relational Model": [1, 2023],
  SQL: [
    56, 1988, 1988, 1990, 1991, 1991, 1997, 1998, 1999, 1999, 1999, 2000, 2000,
    2000, 2001, 2001, 2001, 2001, 2003, 2004, 2005, 2006, 2006, 2006, 2007,
    2009, 2009, 2010, 2011, 2011, 2012, 2012, 2014, 2014, 2014, 2014, 2015,
    2015, 2016, 2017, 2017, 2018, 2019, 2020, 2021, 2021, 2022, 2023, 2024,
    2024, 2004, 2004, 2004, 2005, 2006, 2006, 2008,
  ],
  "Transaction and Concurrency": [
    28, 1999, 2003, 2003, 2006, 2007, 2009, 2010, 2010, 2012, 2015, 2015, 2015,
    2016, 2016, 2016, 2016, 2017, 2019, 2020, 2021, 2024, 2024, 2004, 2004,
    2005, 2005, 2007, 2008,
  ],
};

const COA = {
  "Addressing Mode": [
    18, 1987, 1988, 1989, 1993, 1996, 1998, 1999, 2000, 2001, 2002, 2004, 2005,
    2005, 2008, 2011, 2017, 2006, 2006,
  ],
  "CISC RISC Architecture": [2, 1999, 2018],
  "Cache Memory": [
    71, 1987, 1989, 1990, 1990, 1992, 1993, 1995, 1995, 1996, 1998, 1999, 2001,
    2001, 2002, 2004, 2005, 2006, 2006, 2006, 2006, 2007, 2007, 2007, 2008,
    2008, 2008, 2008, 2009, 2010, 2010, 2011, 2012, 2012, 2013, 2014, 2014,
    2014, 2014, 2014, 2015, 2015, 2016, 2016, 2017, 2017, 2017, 2017, 2017,
    2017, 2018, 2019, 2019, 2020, 2020, 2021, 2021, 2021, 2022, 2022, 2022,
    2023, 2024, 2024, 2004, 2004, 2005, 2006, 2006, 2007, 2008, 2008,
  ],
  DMA: [9, 2004, 2005, 2011, 2016, 2021, 2022, 2024, 2024, 2004],
  "Data Dependancy": [2, 2015, 2007],
  "Data Path": [6, 1990, 2001, 2005, 2005, 2016, 2020],
  "IO Handling": [7, 1987, 1987, 1990, 1996, 1996, 1997, 2008],
  "Instruction Execution": [6, 1990, 1992, 1995, 2002, 2006, 2017],
  "Instruction Format": [
    9, 1988, 1992, 1994, 2014, 2016, 2018, 2020, 2024, 2024,
  ],
  Interrupts: [8, 1987, 1995, 1998, 2002, 2005, 2009, 2020, 2023],
  "Machine Instruction": [
    20, 1988, 1994, 1999, 2003, 2003, 2004, 2004, 2006, 2007, 2007, 2007, 2007,
    2008, 2015, 2016, 2021, 2023, 2004, 2007, 2008,
  ],
  "Memory Interfacing": [6, 1991, 2006, 2016, 2018, 2019, 2023],
  Microprogramming: [
    13, 1987, 1987, 1996, 1997, 1999, 2002, 2004, 2013, 2004, 2005, 2005, 2006,
    2008,
  ],
  Pipelining: [
    42, 1999, 2000, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2008,
    2008, 2009, 2010, 2011, 2012, 2013, 2014, 2014, 2014, 2015, 2015, 2015,
    2016, 2016, 2017, 2018, 2020, 2021, 2021, 2022, 2023, 2024, 2024, 2024,
    2004, 2005, 2006, 2006, 2007, 2008,
  ],
  "Runtime Envirnment": [2, 2001, 2008],
  Speedup: [4, 2014, 2024, 2004, 2007],
  "Virtual Memory": [3, 1991, 2004, 2008],
};

const OS = {
  "Context Switching": [4, 1999, 2000, 2011, 2024],
  "Deadlock Prevention Avoidance Detection": [4, 2018, 2018, 2021, 2004],
  Disk: [
    31, 1990, 1993, 1993, 1995, 1997, 1998, 1998, 1998, 1999, 2001, 2001, 2001,
    2003, 2004, 2005, 2007, 2008, 2009, 2009, 2011, 2012, 2013, 2015, 2015,
    2018, 2024, 2024, 2005, 2005, 2005, 2007,
  ],
  "Disk Scheduling": [
    14, 1989, 1990, 1995, 1997, 1999, 2004, 2009, 2014, 2015, 2016, 2020, 2004,
    2007, 2007,
  ],
  "File System": [9, 1996, 2002, 2008, 2014, 2017, 2019, 2021, 2022, 2004],
  "Fork System Call": [7, 2005, 2008, 2012, 2019, 2023, 2024, 2004],
  "IO Handline": [6, 1996, 1998, 2005, 2005, 2004, 2006],
  "Inter Process Communication": [1, 1997],
  Interrupts: [7, 1993, 1997, 1998, 1999, 2001, 2011, 2018],
  "Memory Managment": [
    10, 1992, 1995, 1996, 1998, 2014, 2015, 2020, 2022, 2006, 2007,
  ],
  "OS Protection": [3, 1999, 2001, 2005],
  "Page Replacement": [
    32, 1993, 1994, 1994, 1995, 1995, 1997, 1997, 1997, 2001, 2002, 2004, 2005,
    2007, 2007, 2007, 2009, 2010, 2012, 2014, 2014, 2014, 2015, 2016, 2016,
    2017, 2021, 2021, 2022, 2023, 2007, 2007, 2008,
  ],
  "Precedence Graph": [3, 1989, 1991, 1992],
  Process: [5, 1996, 2001, 2002, 2023, 2006],
  "Process Scheduling": [
    47, 1988, 1988, 1990, 1993, 1995, 1995, 1996, 1998, 1998, 1998, 2002, 2003,
    2004, 2006, 2006, 2006, 2007, 2007, 2009, 2010, 2011, 2012, 2013, 2014,
    2014, 2014, 2015, 2015, 2015, 2016, 2016, 2017, 2017, 2019, 2020, 2020,
    2021, 2021, 2022, 2023, 2024, 2024, 2005, 2006, 2006, 2007, 2008,
  ],
  "Process Synchronization": [
    52, 1987, 1987, 1988, 1990, 1991, 1991, 1993, 1994, 1995, 1996, 1996, 1996,
    1997, 1997, 1998, 1999, 1999, 2000, 2000, 2001, 2002, 2002, 2002, 2003,
    2003, 2004, 2006, 2006, 2006, 2007, 2009, 2010, 2010, 2012, 2013, 2013,
    2014, 2015, 2015, 2016, 2016, 2017, 2018, 2019, 2024, 2004, 2005, 2005,
    2006, 2007, 2007, 2008,
  ],
  "Resource Allocation": [
    27, 1988, 1989, 1992, 1993, 1994, 1996, 1997, 1997, 1998, 2000, 2001, 2005,
    2006, 2007, 2008, 2009, 2010, 2013, 2014, 2014, 2015, 2015, 2017, 2019,
    2022, 2005, 2008,
  ],
  Semaphore: [10, 1990, 1992, 1998, 2008, 2016, 2020, 2021, 2022, 2023, 2006],
  "System Call": [1, 2021],
  Threads: [10, 2004, 2007, 2011, 2014, 2017, 2017, 2021, 2024, 2024, 2004],
  "Virtual Memory": [
    43, 1989, 1990, 1990, 1991, 1994, 1995, 1995, 1996, 1998, 1999, 1999, 1999,
    2000, 2001, 2001, 2001, 2002, 2003, 2003, 2003, 2006, 2006, 2008, 2009,
    2009, 2011, 2013, 2013, 2014, 2015, 2015, 2015, 2016, 2018, 2019, 2020,
    2023, 2024, 2024, 2024, 2004, 2008, 2008,
  ],
};

const DM_Combinatory = {
  "Balls in Bins": [4, 2002, 2003, 2002, 2004],
  Combinatory: [
    21, 1989, 1990, 1990, 1991, 1991, 1998, 1999, 1999, 2000, 2001, 2003, 2003,
    2004, 2007, 2007, 2014, 2015, 2019, 2020, 2005, 2008,
  ],
  Counting: [4, 1994, 2021, 2021, 2023],
  "Generating Function": [6, 1987, 2005, 2016, 2017, 2018, 2022],
  "Modular Arithematic": [2, 2016, 2019],
  "Pigeonhole Principle": [2, 2000, 2005],
  "Recurrance Relation": [7, 1996, 2016, 2016, 2022, 2023, 2004, 2007],
  Summation: [3, 1994, 2008, 2015],
};

const DM_Graph_Theory = {
  Counting: [3, 2001, 2004, 2012],
  "Degree of Graph": [
    12, 1987, 1991, 1995, 2003, 2006, 2006, 2009, 2010, 2010, 2013, 2014, 2017,
  ],
  "Graph Coloring": [
    11, 2002, 2004, 2009, 2016, 2018, 2020, 2023, 2024, 2024, 2006, 2008,
  ],
  "Graph Connectivity": [
    40, 1987, 1988, 1990, 1991, 1992, 1993, 1994, 1994, 1994, 1995, 1999, 1999,
    2002, 2003, 2004, 2005, 2006, 2007, 2008, 2013, 2014, 2014, 2014, 2015,
    2019, 2019, 2021, 2022, 2022, 2022, 2024, 2024, 2024, 2002, 2004, 2005,
    2006, 2007, 2008, 2008,
  ],
  "Graph Isomorphism": [1, 2022],
  "Graph Matching": [1, 2003],
  "Graph Pianarity": [
    13, 1987, 1989, 1990, 1992, 1992, 2005, 2005, 2008, 2011, 2012, 2014, 2015,
    2021,
  ],
};

const DM_Math_Logic = {
  "First Order Logic": [
    32, 1989, 1991, 1992, 2003, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2009,
    2010, 2011, 2012, 2013, 2013, 2014, 2014, 2015, 2016, 2017, 2018, 2019,
    2020, 2023, 2004, 2005, 2006, 2007, 2008, 2008,
  ],
  "Logical Reasoning": [3, 2012, 2015, 2015],
  "Propositional Logic": [
    40, 1987, 1988, 1989, 1990, 1991, 1992, 1992, 1993, 1993, 1994, 1995, 1995,
    1996, 1997, 1998, 1999, 2000, 2001, 2002, 2002, 2003, 2004, 2005, 2006,
    2008, 2009, 2014, 2014, 2014, 2015, 2016, 2016, 2017, 2017, 2017, 2021,
    2021, 2024, 2024, 2004,
  ],
};

const DM_Set_Theory_And_Algebra = {
  "Binary Operation": [8, 1989, 1994, 2003, 2006, 2013, 2015, 2015, 2006],
  "Countable Uncountable Set": [2, 1994, 2018],
  Functions: [
    29, 1987, 1988, 1989, 1993, 1996, 1996, 1997, 1998, 2001, 2001, 2003, 2003,
    2005, 2006, 2006, 2007, 2012, 2014, 2014, 2014, 2015, 2015, 2015, 2016,
    2021, 2023, 2024, 2005, 2006,
  ],
  "Group Theory": [
    33, 1988, 1990, 1992, 1993, 1994, 1995, 1995, 1995, 1996, 1997, 1998, 1999,
    2000, 2002, 2003, 2004, 2005, 2005, 2006, 2007, 2009, 2009, 2010, 2014,
    2014, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2024,
  ],
  Lattice: [9, 1988, 1990, 1994, 1997, 2002, 2005, 2015, 2017, 2008],
  "Mathematical Induction": [2, 1995, 2000],
  "Number Theory": [7, 1995, 2014, 2015, 2005, 2007, 2008, 1991],
  "Partial Order": [
    11, 1991, 1992, 1993, 1996, 1997, 1998, 2003, 2004, 2007, 2024, 2007,
  ],
  Polynomials: [4, 1997, 2002, 2014, 2017],
  Relations: [
    36, 1987, 1987, 1987, 1989, 1992, 1994, 1995, 1996, 1996, 1997, 1997, 1998,
    1988, 1988, 1988, 1988, 1999, 1999, 1999, 2000, 2001, 2002, 2002, 2004,
    2005, 2005, 2006, 2007, 2009, 2010, 2015, 2015, 2016, 2020, 2021, 2004,
  ],
  "Set Theory": [
    27, 1993, 1993, 1993, 1994, 1994, 1995, 1996, 1998, 2000, 2000, 2001, 2001,
    2005, 2006, 2006, 2008, 2014, 2015, 2015, 2015, 2016, 2017, 2021, 2004,
    2005, 2006, 2006,
  ],
};

const EM_Calculus = {
  Continuity: [8, 1996, 1998, 2007, 2013, 2014, 2015, 2021, 2010],
  "Definite Integral": [2, 2023, 2024],
  Diffrentiation: [6, 1996, 2014, 2014, 2016, 2017, 2024],
  Integration: [10, 1998, 2000, 2009, 2011, 2014, 2014, 2015, 2015, 2018, 2005],
  Limits: [
    13, 1993, 1995, 2008, 2010, 2015, 2015, 2016, 2017, 2019, 2021, 2022, 2024,
    2024,
  ],
  "Maxima Minima": [
    10, 1987, 1995, 1995, 1997, 2008, 2012, 2015, 2020, 2023, 2008,
  ],
  Polynomial: [2, 1987, 1995],
};

const EM_Linear_Algebra = {
  "Cartesian Coordinate": [1, 2007],
  Determinant: [10, 1997, 2000, 2013, 2014, 2019, 2023, 2024, 2024, 2004, 2005],
  "Eigen Value": [
    31, 1993, 2002, 2005, 2007, 2008, 2010, 2011, 2012, 2014, 2014, 2014, 2015,
    2015, 2015, 2016, 2016, 2017, 2017, 2017, 2018, 2018, 2019, 2021, 2022,
    2023, 2024, 2024, 2024, 2006, 2007, 2014,
  ],
  Matrix: [
    19, 1987, 1988, 1993, 1994, 1994, 1996, 1996, 1997, 1998, 2001, 2004, 2004,
    2004, 2006, 2015, 2015, 2022, 2004, 2008,
  ],
  "Rank of Matrix": [6, 1994, 1995, 1998, 2002, 2020, 2021],
  "System of Equations": [
    14, 1997, 1998, 1998, 2003, 2004, 2005, 2008, 2014, 2015, 2016, 2017, 2022,
    2024, 2004,
  ],
  "Vector Space": [4, 1995, 2007, 2014, 2017],
};

const EM_Probability = {
  "Binomial Distribution": [6, 2002, 2005, 2006, 2005, 2006, 2007],
  "Conditional Probability": [
    14, 1994, 1994, 2003, 2005, 2008, 2009, 2011, 2012, 2016, 2017, 2018, 2021,
    2024, 2006,
  ],
  "Continuous Distribution": [1, 2016],
  Expectation: [10, 1999, 2004, 2006, 2011, 2013, 2014, 2017, 2021, 2021, 2024],
  "Exponential Distribution": [3, 2021, 2024, 2004],
  "Independent Events": [5, 1994, 1999, 2000, 2023, 2024],
  "Normal Distribution": [2, 2008, 2017],
  "Poisson Distribution": [4, 1989, 2013, 2017, 2007],
  Probability: [
    27, 1995, 1995, 1996, 1996, 1997, 1998, 2001, 2004, 2010, 2010, 2011, 2014,
    2014, 2014, 2014, 2016, 2018, 2021, 2024, 2024, 2024, 2024, 2024, 2004,
    2005, 2008, 2008,
  ],
  "Probability Density Function": [1, 2003],
  "Random Variable": [4, 2005, 2011, 2012, 2015],
  Statistics: [2, 2021, 2024],
  "Uniform Distribution": [
    9, 1998, 2004, 2004, 2007, 2014, 2019, 2020, 2024, 2024,
  ],
};

// False: i.e. no fault in subject
// True: i.e. fault in subject
const verifySubjectFault = (subject) => {
  if (typeof subject != "object" || Array.isArray(subject)) {
    console.log("Invalid Subject format");
    return true;
  }

  const keys = Object.keys(subject);
  const values = Object.values(subject);

  if (values.length === 0) {
    console.log("Empty Subject");
    return true;
  }

  let faultFound = false;
  for (let i = 0; i < values.length; i++) {
    if (!Array.isArray(values[i])) {
      console.log("Invalid Topic format, i.e. Not an Array");
      console.log("Topic:", keys[i]);
      faultFound = true;
    } else {
      if (values[i][0] != values[i].length - 1) {
        console.log("No. of Question did not match the count:");
        console.log("Topic", keys[i]);
        console.log("Count:", values[i][0]);
        console.log("Questions:", values[i].length - 1);
        faultFound = true;
      }
    }
  }
  return faultFound;
};

const countTotalQuestions = (subject) => {
  if (verifySubjectFault(subject)) return null;

  const keys = Object.keys(subject);
  total = 0;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = subject[key];

    for (let j = 1; j < value.length; j++) {
      const queYear = value[j];
      if (queYear >= fromYears && queYear <= toYears) total += 1;
    }
  }
  return total;
};

const round = (num) => {
  if (typeof num != "number") {
    throw new Error("Invalid Number Format in rounding function");
  }
  return parseFloat(num.toFixed(3));
};

function sortTopicsByQuestions(subject) {
  // Convert the subject object into an array of entries [key, value]
  const sortedEntries = Object.entries(subject).sort(
    (a, b) => b[1].length - a[1].length
  ); // Sort by the length of the value array (number of questions)

  // Convert the sorted entries back into an object
  const sortedSubject = Object.fromEntries(sortedEntries);

  return sortedSubject;
}

const returnTopicPercetage = (subject) => {
  const numOfQue = countTotalQuestions(subject);

  if (typeof numOfQue != "number") {
    return null;
  }
  const keys = Object.keys(subject);

  const updatedSubject = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = subject[key];
    const topicQue = [];

    for (let j = 1; j < value.length; j++) {
      const queYear = value[j];
      if (queYear >= fromYears && queYear <= toYears) topicQue.push(queYear);
    }

    // if (topicQue.length == 0) topicQue.push(value[1]);

    if (topicQue.length > 0) {
      updatedSubject[key] = [
        topicQue.length,
        `${value.length - 1} | ${round((topicQue.length * 100) / numOfQue)}%`,
        ...topicQue,
      ];
    }
  }

  return sortTopicsByQuestions(updatedSubject);
};

const copy = (the_variable) => {
  return JSON.parse(JSON.stringify(the_variable));
};

const combineSubjects = (subjects) => {
  if (typeof subjects != "object" || Array.isArray(subjects)) {
    console.log("Invalid Combine Subject format");
    return true;
  }

  const combinedSubject = {};
  const subject_keys = Object.keys(subjects);

  for (let i = 0; i < subject_keys.length; i++) {
    const subject_name = subject_keys[i];
    const subject_content = subjects[subject_name];
    const questions_arr = [];

    if (verifySubjectFault(subject_content)) return undefined;

    const topics = Object.keys(subject_content);

    for (let j = 0; j < topics.length; j++) {
      const topic_name = topics[j];
      const topic_content = copy(subject_content[topic_name]);
      topic_content.shift();
      questions_arr.push(...topic_content);
    }
    combinedSubject[subject_name] = [questions_arr.length, ...questions_arr];
  }

  return combinedSubject;
};

const subjects = {
  Algorithm: Algo,
  "Compiler Design": CD,
  "Computer Networks": CN,
  Databases: DBMS,
  "Digital Logic": DL,
  "Computer Organization & Architecture": COA,
  "C Programming": C,
  "Data Structures": DS,
  "Theory of Computation": TOC,
  "Operating System": OS,

  "Discrete Math": combineSubjects({
    DM_Combinatory,
    DM_Graph_Theory,
    DM_Math_Logic,
    DM_Set_Theory_And_Algebra,
  }),

  "Discrete Math: Combinatory": DM_Combinatory,
  "Discrete Math: Graph Theory": DM_Graph_Theory,
  "Discrete Math: Mathematical Logic": DM_Math_Logic,
  "Discrete Math: Set Theory & Algebra": DM_Set_Theory_And_Algebra,

  "Engineering Math": combineSubjects({
    EM_Calculus,
    EM_Linear_Algebra,
    EM_Probability,
  }),

  "Engineering Math: Calculus": EM_Calculus,
  "Engineering Math: Linear Algebra": EM_Linear_Algebra,
  "Engineering Math: Probability": EM_Probability,
};

const subject_code = {
  // Algorithm: "algo",
  "Compiler Design": "cd",
  "Computer Networks": "cn",
  Databases: "dbms",
  "Digital Logic": "dl",
  "Computer Organization & Architecture": "coa",
  "C Programming": "c",
  "Data Structures": "ds",
  "Theory of Computation": "toc",
  "Operating System": "os",

  "Discrete Math": "dm_total",
  "Engineering Math": "em_total",

  "Discrete Math: Combinatory": "dm",
  "Discrete Math: Graph Theory": "dm",
  "Discrete Math: Mathematical Logic": "dm",
  "Discrete Math: Set Theory & Algebra": "dm",

  "Engineering Math: Calculus": "em",
  "Engineering Math: Linear Algebra": "em",
  "Engineering Math: Probability": "em",
};

const combinedSubject_keys = ["dm_total", "em_total"];

if (inpSubCode.length == 0) {
  const subject_code_values = Object.values(subject_code);

  for (let i = 0; i < subject_code_values.length; i++) {
    if (!combinedSubject_keys.includes(subject_code_values[i]))
      inpSubCode.push(subject_code_values[i]);
  }
}

subjectName = Object.keys(subjects);
all_pyq = 0;

function repeatSpaces(n) {
  let temp = "";
  for (let i = 0; i < n; i++) {
    temp += "";
  }
  return temp;
}

// const queFrom = "all";
const queFrom = fromYears;
for (let i = 0; i < subjectName.length; i++) {
  const currentSubCode = subject_code[subjectName[i]];
  if (!inpSubCode.includes(currentSubCode)) continue;
  console.log(i + 1, "Subject:", subjectName[i]);
  console.log("------------------------------------------------");
  const subject = returnTopicPercetage(subjects[subjectName[i]], queFrom);
  const topics = Object.keys(subject);
  let total = 0;
  for (let j = 0; j < topics.length; j++) {
    const topicName = topics[j];
    const topicQue = subject[topics[j]][0];
    const topicPercent = subject[topics[j]][1];
    const topicDetails = JSON.parse(JSON.stringify(subject[topics[j]]));
    topicDetails.shift();
    topicDetails.shift();

    if (!onlyTotal)
      console.log(
        `${j + 1 < 10 ? " " : ""}${j + 1}.`,
        topicName,
        repeatSpaces(50 - topicName.length),
        `|${topicQue < 10 ? " " : ""}`,
        topicQue,
        "of",
        topicPercent,
        showYears ? "|" : "",
        showYears ? topicDetails.sort((a, b) => a - b) : ""
      );

    total = total + subject[topics[j]][0];
  }
  console.log("Total: ", total);
  console.log("");
  all_pyq += total;
}

console.log("------------------------------------------------");
console.log("ALL PYQ:", all_pyq);
