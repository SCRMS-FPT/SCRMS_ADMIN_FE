const RevenueChart = ({ data }) => {
  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <CartesianGrid strokeDasharray="3 3" />
      <Line type="monotone" dataKey="revenue" stroke="#ff0000" />
    </LineChart>
  );
};

export default RevenueChart;
