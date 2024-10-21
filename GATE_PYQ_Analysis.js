const subjects = {
  "Computer Networks": {
    "Application Layer Protocol": [
      12, 2008, 2011, 2012, 2016, 2019, 2020, 2022, 2005, 2005, 2005, 2006,
      2008,
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
      12, 2006, 2010, 2014, 2014, 2015, 2015, 2016, 2024, 2024, 2024, 2004,
      2024,
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
      13, 2005, 2014, 2014, 2014, 2017, 2020, 2023, 2024, 2024, 2005, 2005,
      2007, 2008,
    ],
    "Sliding Window": [
      15, 2003, 2005, 2006, 2006, 2007, 2009, 2009, 2014, 2015, 2016, 2004,
      2004, 2004, 2006, 2008,
    ],
    Socket: [4, 2008, 2008, 2014, 2015],
    "Stop & Wait": [6, 2015, 2016, 2017, 2023, 2005, 2006],
    Subnetting: [
      20, 2003, 2004, 2005, 2006, 2007, 2008, 2010, 2012, 2015, 2015, 2019,
      2020, 2022, 2023, 2004, 2005, 2006, 2006, 2008, 2008,
    ],
    TCP: [
      21, 2009, 2012, 2015, 2015, 2015, 2016, 2017, 2018, 2020, 2021, 2021,
      2021, 2022, 2023, 2024, 2024, 2004, 2004, 2007, 2007, 2008,
    ],
    "Token Bucket": [2, 2008, 2016],
    UDP: [3, 2005, 2013, 2017],
  },
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

const countTotalQuestions = (subject, year = "all") => {
  if (year == "all") year = 0;

  if (typeof year != "number") {
    console.log("Invalid Year Format:", year, typeof year);
    return null;
  }

  if (verifySubjectFault(subject)) return null;

  const keys = Object.keys(subject);
  total = 0;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = subject[key];

    for (let j = 1; j < value.length; j++) {
      const queYear = value[j];
      if (queYear >= year) total += 1;
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

const returnTopicPercetage = (subject, year = "all") => {
  const numOfQue = countTotalQuestions(subject, year);
  if (year == "all") year = 0;
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
      if (queYear >= year) topicQue.push(queYear);
    }

    if (topicQue.length > 0) {
      updatedSubject[key] = [
        topicQue.length,
        `${round((topicQue.length * 100) / numOfQue)}%`,
        ...topicQue,
      ];
    }
  }

  return sortTopicsByQuestions(updatedSubject);
};

console.log(returnTopicPercetage(subjects["Computer Networks"], 2014));
