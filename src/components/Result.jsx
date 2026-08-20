import Table from "./Table";

const Result = ({ data }) => {
  return (
    <div className="mt-30">
      <h1 className="text-gray text-5xl">Results</h1>
      <Table data={data} />
      <span className="mx-15 block text-left">{data.advice}</span>
    </div>
  );
};

export default Result;
