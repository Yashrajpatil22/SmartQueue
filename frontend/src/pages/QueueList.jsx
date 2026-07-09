import React, {useEffect} from 'react'
import axios from 'axios'

function QueueList() {
    const [queues, setQueues] = React.useState([]);
  return (
    <div>
        <h1>Queues</h1>
        {queues.map((queue) => (
          <div key={queue.id}>
            <h2>{queue.name}</h2>
            <h2>{queue.status}</h2>
          </div>
        ))}
        <button>Add Queue</button>
    </div>
  )
}

export default QueueList