let chart = new Chart(document.querySelector('#chart'), {
  type: 'scatter',
  data: chartData(),
  options: chartOptions()
})

document.querySelector('#plot')?.addEventListener('click', () => {
  !chart.data.datasets[0].data.includes({
    x: Number(document.querySelector('#humidity')?.value),
    y: Number(document.querySelector('#pressure')?.value),
  }) ?
  chart.data.datasets[0].data.push({
    x: Number(document.querySelector('#humidity')?.value),
    y: Number(document.querySelector('#pressure')?.value),
  }) : alert('Dot already exists')
  chart.update()
})

document.querySelector('#predict')?.addEventListener('click', () => {
  const x = chart.data.datasets[0].data[chart.data.datasets[0].data.length-1].x
  const y = chart.data.datasets[0].data[chart.data.datasets[0].data.length-1].y
  let distances = []

  trainingSet().forEach((point) => {
    distances.push(Math.sqrt(((x - point.humidity)**2) + ((y - point.pressure)**2)))

    let redNeighbors = 0
    let blueNeighbors = 0

    for(let k=1; k<=Number(document.querySelector('#radius')?.value); k++) {
      const minDist = Math.min.apply(Math, distances)
      const index = distances.indexOf(minDist)
      chart.data.datasets[0].pointBackgroundColor[index] == 'red' ? redNeighbors++ : blueNeighbors++
      // distances[index] = +Infinity
    }

    if (redNeighbors >= blueNeighbors) {
      document.querySelector('#output').innerHTML = 'Most probably red'
      chart.data.datasets[0].pointBackgroundColor[chart.data.datasets[0].data.length-1] = 'red'
    } else {
      document.querySelector('#output').innerHTML = 'Most probably blue'
      chart.data.datasets[0].pointBackgroundColor[chart.data.datasets[0].data.length-1] = 'blue'
    }

    chart.update()
  })
})

document.querySelector('#delete')?.addEventListener('click', () => {

  let index = chart.data.datasets[0].data.findIndex((point) => {
    return point.x === document.querySelector('#humidity')?.value && point.y == Number(document.querySelector('#pressure')?.value);
  });
  // slice index with id 2
  chart.data.datasets[0].data = [...chart.data.datasets[0].data.slice(0, index), ...chart.data.datasets[0].data.slice(index + 1)];

  chart.update()
})