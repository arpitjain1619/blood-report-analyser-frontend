const Table = ({ data }) => {
  return (
    <div className="my-10 flex px-15">
      <table>
        <thead className="border-b border-white">
          <tr className="h-15">
            <th className="w-100">Biomarker</th>
            <th className="w-100">Value</th>
            <th className="w-100">Status</th>
            <th className="w-100">Range</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(data.categorized).map(([biomarker, item]) => {
            let statusClass = "";

            if (item.status === "High") {
              statusClass = "bg-pink-100 text-[#722F37]";
            }

            if (item.status === "Normal") {
              statusClass = "bg-green-300 text-green-800";
            }

            if (item.status === "Low") {
              statusClass = "bg-yellow-100 text-yellow-800";
            }

            return (
              <tr
                key={biomarker}
                className="border-b border-gray shadow-gray-100 h-15"
              >
                <td className="w-100 text-left px-1">{biomarker}</td>
                <td className="w-100">{item.value}</td>
                <td className="w-100">
                  <span className={`${statusClass} px-5 py-3 rounded-lg`}>
                    {item.status}
                  </span>
                </td>
                <td className="w-100">{item.normal_range}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
