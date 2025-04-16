import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function App() {
  const meanUV = data.reduce((acc, item) => acc + item.uv, 0) / data.length
  const meanPV = data.reduce((acc, item) => acc + item.pv, 0) / data.length
  const standardDeviationUV = Math.sqrt(data.reduce((acc, item) => acc + Math.pow(item.uv - meanUV, 2), 0) / (data.length - 1))
  const standardDeviationPV = Math.sqrt(data.reduce((acc, item) => acc + Math.pow(item.pv - meanPV, 2), 0) / (data.length - 1))
  const zScoreData = data.map(item => ({ name: item.name, uv: (item.uv - meanUV) / standardDeviationUV, pv: (item.pv - meanPV) / standardDeviationPV }))

  const gradientOffset = (type: 'pv' | 'uv') => {
    const dataMax = Math.max(...zScoreData.map((i) => i[type]));
    const dataMin = Math.min(...zScoreData.map((i) => i[type]));
  
    const up = (dataMax - 1) / (dataMax - dataMin);
    const down = (dataMax + 1) / (dataMax - dataMin);

    return {up, down};
  };
  
  const offPv = gradientOffset('pv');
  const offUv = gradientOffset('uv');

  const CustomizedDot = (props: any) => {
    const { cx, cy, value, data, color, active } = props;

    const zscore = data === 'pv' ? (value - meanPV) / standardDeviationPV : (value - meanUV) / standardDeviationUV

    if (Math.abs(zscore) > 1) {
      return (
        <circle cx={cx} cy={cy} r={3} fill={active ? 'red' : '#FFF'} strokeWidth={1} stroke='red' />
      );
    }

    return (
      <circle cx={cx} cy={cy} r={3} fill={active ? color : '#FFF'} strokeWidth={1} stroke={color} />
    );

  };

  return (
    <>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          width={500}
          height={300}
          data={data}
          syncId="anyId"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <defs>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offPv.up} stopColor="red"  />
              <stop offset={offPv.up} stopColor="#8884d8"  />
              <stop offset={offPv.down} stopColor="#8884d8"  />
              <stop offset={offPv.down} stopColor="red"  />
            </linearGradient>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offUv.up} stopColor="red"  />
              <stop offset={offUv.up} stopColor="#82ca9d"  />
              <stop offset={offUv.down} stopColor="#82ca9d"  />
              <stop offset={offUv.down} stopColor="red"  />
            </linearGradient>
          </defs>
          <Line type="monotone" dataKey="pv" stroke='url(#colorPv)' dot={<CustomizedDot data="pv" color="#8884d8"/>} activeDot={<CustomizedDot data="pv" color="#8884d8" active/>} />
          <Line type="monotone" dataKey="uv" stroke='url(#colorUv)' dot={<CustomizedDot data="uv" color="#82ca9d"/>} activeDot={<CustomizedDot data="uv" color="#82ca9d" active/>}/>
        </LineChart>
      </ResponsiveContainer>
      <p style={{ paddingLeft: 70 }}>z-score</p>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          width={500}
          height={300}
          data={zScoreData}
          syncId="anyId"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis ticks={[-1, 1]} />
          <Tooltip />
          <Legend />
          <ReferenceLine y={1} stroke="red" />
          <ReferenceLine y={-1} stroke="red" />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}

export default App
