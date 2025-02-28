"use strict";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [currentArray, setCurrentArray] = useState([]);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [arraySize, setArraySize] = useState(50);
  const [isSorting, setIsSorting] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble");

  // Sorting Algorithms
  const bubbleSort = (array) => {
    const moves = [];
    const arrayCopy = [...array];
    do {
      var swapped = false;
      for (let i = 1; i < arrayCopy.length; i++) {
        moves.push([i - 1, i, null, null]);
        if (arrayCopy[i - 1] > arrayCopy[i]) {
          swapped = true;
          moves.push([i - 1, i, arrayCopy[i], arrayCopy[i - 1]]);
          [arrayCopy[i - 1], arrayCopy[i]] = [arrayCopy[i], arrayCopy[i - 1]];
        }
      }
    } while (swapped);
    return moves;
  };

  const insertionSort = (array) => {
    const moves = [];
    const arrayCopy = [...array];
    for (let i = 1; i < arrayCopy.length; i++) {
      let current = arrayCopy[i];
      let j = i - 1;
      moves.push([i, j, null, null]);
      while (j >= 0 && arrayCopy[j] > current) {
        moves.push([j + 1, j, arrayCopy[j], arrayCopy[j + 1]]);
        arrayCopy[j + 1] = arrayCopy[j];
        j--;
      }
      arrayCopy[j + 1] = current;
    }
    return moves;
  };

  const selectionSort = (array) => {
    const moves = [];
    const arrayCopy = [...array];
    for (let i = 0; i < arrayCopy.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arrayCopy.length; j++) {
        moves.push([minIndex, j, null, null]);
        if (arrayCopy[j] < arrayCopy[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        moves.push([i, minIndex, arrayCopy[minIndex], arrayCopy[i]]);
        [arrayCopy[i], arrayCopy[minIndex]] = [
          arrayCopy[minIndex],
          arrayCopy[i],
        ];
      }
    }
    return moves;
  };

  const mergeSort = (array) => {
    const moves = [];
    const arrayCopy = [...array];

    const merge = (left, right, startIdx) => {
      let result = [];
      let i = 0;
      let j = 0;

      while (i < left.length && j < right.length) {
        moves.push([startIdx + i, startIdx + j + left.length, null, null]);
        if (left[i] <= right[j]) {
          result.push(left[i]);
          i++;
        } else {
          result.push(right[j]);
          j++;
        }
      }

      result = [...result, ...left.slice(i), ...right.slice(j)];

      for (let k = 0; k < result.length; k++) {
        if (arrayCopy[startIdx + k] !== result[k]) {
          moves.push([startIdx + k, startIdx + k, result[k], result[k]]);
          arrayCopy[startIdx + k] = result[k];
        }
      }

      return result;
    };

    const mergeSortHelper = (arr, startIdx = 0) => {
      if (arr.length <= 1) return arr;

      const mid = Math.floor(arr.length / 2);
      const left = mergeSortHelper(arr.slice(0, mid), startIdx);
      const right = mergeSortHelper(arr.slice(mid), startIdx + mid);

      return merge(left, right, startIdx);
    };

    mergeSortHelper(arrayCopy);
    return moves;
  };

  const quickSort = (array) => {
    const moves = [];
    const arrayCopy = [...array];

    const partition = (low, high) => {
      const pivot = arrayCopy[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        moves.push([j, high, null, null]);
        if (arrayCopy[j] < pivot) {
          i++;
          moves.push([i, j, arrayCopy[j], arrayCopy[i]]);
          [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
        }
      }

      moves.push([i + 1, high, arrayCopy[high], arrayCopy[i + 1]]);
      [arrayCopy[i + 1], arrayCopy[high]] = [arrayCopy[high], arrayCopy[i + 1]];
      return i + 1;
    };

    const quickSortHelper = (low, high) => {
      if (low < high) {
        const pi = partition(low, high);
        quickSortHelper(low, pi - 1);
        quickSortHelper(pi + 1, high);
      }
    };

    quickSortHelper(0, arrayCopy.length - 1);
    return moves;
  };

  // Visualization Functions
  const createBars = (array) => {
    return array.map((value, index) => (
      <div key={index} className="bar" style={{ height: `${value}px` }} />
    ));
  };

  const updateBars = (moves, array, multiplier) => {
    const bars = document.querySelectorAll(".bar");
    const arrayCopy = [...array];
    const baseSpeed = 100; // base speed in milliseconds
    const speed = baseSpeed / multiplier;

    moves.forEach(([i, j, newI, newJ], index) => {
      setTimeout(() => {
        // Reset all bars to default color
        bars.forEach((bar) => (bar.style.backgroundColor = "#3498db"));

        // Highlight compared elements
        bars[i].style.backgroundColor = "#e74c3c";
        bars[j].style.backgroundColor = "#e74c3c";

        // If there's a swap to perform
        if (newI !== null && newJ !== null) {
          bars[i].style.height = `${newI}px`;
          bars[j].style.height = `${newJ}px`;
          [arrayCopy[i], arrayCopy[j]] = [newI, newJ];
        }

        // Update the current array state
        if (index === moves.length - 1) {
          // On last move, set the final array
          setCurrentArray([...arrayCopy]);
          // Reset colors to default
          setTimeout(() => {
            bars.forEach((bar) => (bar.style.backgroundColor = "#3498db"));
          }, speed);
        }
      }, index * speed);
    });
  };

  // Main Functions
  const generateArray = (size = arraySize) => {
    const newArray = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 300) + 10
    );
    setCurrentArray(newArray);
  };

  const startSorting = (algorithm) => {
    if (isSorting) return; // Prevent starting new sort while one is in progress

    setIsSorting(true);
    const array = [...currentArray];
    let moves;

    switch (algorithm) {
      case "bubble":
        moves = bubbleSort(array);
        break;
      case "insertion":
        moves = insertionSort(array);
        break;
      case "selection":
        moves = selectionSort(array);
        break;
      case "merge":
        moves = mergeSort(array);
        break;
      case "quick":
        moves = quickSort(array);
        break;
      default:
        return;
    }

    updateBars(moves, currentArray, speedMultiplier);

    // Reset isSorting after all moves are complete
    setTimeout(() => {
      setIsSorting(false);
    }, (moves.length * 100) / speedMultiplier + 100);
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  return (
    <div className="App">
      <header className="title">
        <h1>Sorting Visualizer</h1>
      </header>

      <div className="controls-container">
        <div className="control-item">
          <select
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={isSorting}
          >
            <option value="10">10 Elements</option>
            <option value="25">25 Elements</option>
            <option value="50">50 Elements</option>
            <option value="75">75 Elements</option>
            <option value="100">100 Elements</option>
          </select>
        </div>

        <div className="control-item">
          <select
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
            disabled={isSorting}
          >
            <option value="1">1x Speed</option>
            <option value="2">2x Speed</option>
            <option value="3">3x Speed</option>
            <option value="4">4x Speed</option>
            <option value="5">5x Speed</option>
          </select>
        </div>

        <div className="control-item">
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            disabled={isSorting}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
        </div>

        <div className="control-item">
          <button
            onClick={() => generateArray()}
            className="control-btn new-array"
            disabled={isSorting}
          >
            New Array
          </button>
          <button
            onClick={() => startSorting(selectedAlgorithm)}
            className="control-btn sort"
            disabled={isSorting}
          >
            Sort
          </button>
        </div>
      </div>

      <div className="bars-container">{createBars(currentArray)}</div>

      <footer className="footer">
        <p>Created by Kush Goel</p>
      </footer>
    </div>
  );
}

export default App;
