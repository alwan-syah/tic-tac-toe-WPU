import { useState } from 'react'

function Square({ value, onSquareClick }) {

  // jadi ketika di klik akan masuk ke function 
  return <button className='square' onClick={onSquareClick}>{value}</button>
}

function Board({ xIsNext, squares, onPlay }) {
  // value square ini awalnya null semua, jadi ketika di klik akan berubah menjadi X atau O


  // function ini untuk mengubah isi dari array nya
  function handleClick(i) {

    if (squares[i] || calculateWinner(squares)) return // jika sudah ada value di square maka tidak bisa di klik lagi
    // buat array baru
    // ini membuat duplikat array dari squares, menggunakan konsep immutability
    const nextSquares = squares.slice() // bikin salinan dari array squares

    // untuk cek giliran X atau O, jika xIsNext true maka giliran X, jika false maka giliran O
    nextSquares[i] = xIsNext ? 'X' : 'O' // jika xIsNext true maka isi array dengan X, jika false maka isi array dengan O
    onPlay(nextSquares) // untuk mengubah state squares di parent component (Game)
  }

  const winner = calculateWinner(squares) // untuk menentukan pemenang
  let status = ''
  if (winner) {
    status = 'Winner: ' + winner
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }

  return (
    // untuk menampilkan status pemenang atau giliran pemain
    // untuk board nya tau value dari square nya
      // setiap square punya props
    <>
      
      <div className="status">{status}</div>  
      
      <div className="board">
      <Square value={squares[0]} onSquareClick={()=>handleClick(0)}/> 
      <Square value={squares[1]} onSquareClick={()=>handleClick(1)}/> 
      <Square value={squares[2]} onSquareClick={()=>handleClick(2)}/>
      <Square value={squares[3]} onSquareClick={()=>handleClick(3)}/>
      <Square value={squares[4]} onSquareClick={()=>handleClick(4)}/>
      <Square value={squares[5]} onSquareClick={()=>handleClick(5)}/>
      <Square value={squares[6]} onSquareClick={()=>handleClick(6)}/>
      <Square value={squares[7]} onSquareClick={()=>handleClick(7)}/>
      <Square value={squares[8]} onSquareClick={()=>handleClick(8)}/>
      </div>
    </>
  )
}

// untuk menyimpan board dan square nya, jadi ketika di klik akan berubah menjadi X atau O
export default function Game() {
  // mulai dari giliran X
  

  // array dalam array, untuk menyimpan history dari board, jadi ketika di klik akan berubah menjadi X atau O
  const [history, setHistory] = useState([Array(9).fill(null)]) 
  const [currentMove, setCurrentMove] = useState(0) // state untuk menentukan giliran ke berapa
  const xIsNext = currentMove % 2 === 0 // untuk menentukan giliran X atau O, jika currentMove genap maka giliran X, jika ganjil maka giliran O
  const currentSquares = history[currentMove] // untuk mengambil array sesuai dengan giliran saat ini

  function jumpTo(nextMove) {
    setCurrentMove(nextMove) // untuk mengubah giliran ke berapa
    
  }

  // dijalankan ketika onPlay dipanggil, untuk mengubah state history dan xIsNext
  function handleplay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares] // untuk mengcopy array history dan menambahkan array nextSquares ke dalamnya
    setHistory(nextHistory) // untuk mengcopy array history dan menambahkan array nextSquares ke dalamnya
    setCurrentMove(nextHistory.length - 1) // untuk mengubah giliran ke berapa
    
    
  }

  // untuk menampilkan history dari board, jadi ketika di klik akan berubah menjadi X atau O
  const moves = history.map((squares, move) => {
    let description = '';
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    // untuk menampilkan button untuk kembali ke giliran sebelumnya
    return (
      // looping li harus ada key nya, karena react butuh key untuk membedakan setiap li
      <li key={move}> 
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    ); 
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handleplay}/>
      </div>
      <div className="game-info">
        
        <ol>{moves}</ol> 
      </div>
    </div>
  )
}

// function untuk menentukan pemenang, yg akan menyimpan keadaan boardnya
function calculateWinner(squares) {
  // array untuk menentukan kombinasi pemenang, baris yg terisi 3 kotak, kolom yg terdiri 3 kotak, diagonal yg terdiri 3 kotak
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return false
}