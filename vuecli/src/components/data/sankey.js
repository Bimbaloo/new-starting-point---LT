let series = {
  type: 'sankey',
  layout: 'none',
  layoutIterations: 0,
  animation: false,
  data: [
    {
      name: 'a'
    }, {
      name: 'b'
    }, {
      name: 'a1'
    }, {
      name: 'a2'
    }, {
      name: 'b1'
    }, {
      name: 'c'
    }
  ],
  links: [
    {
      source: 'a',
      target: 'a2',
      value: 3
    },
    {
      source: 'a',
      target: 'a1',
      value: 5
    },
    {
      source: 'b',
      target: 'b1',
      value: 8
    },
    {
      source: 'a',
      target: 'b1',
      value: 3
    },

    {
      source: 'b1',
      target: 'c',
      value: 2
    },
    {
      source: 'b1',
      target: 'a1',
      value: 1
    }
  ]
}

export default function sankeyData () {
  return {
    legend: {},
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: function (e) {
        return e.name + ': ' + e.value + '%'
      }
    },

    // xAxis: { type: 'sankey' },
    // yAxis: {},
    series: series
  }
}
