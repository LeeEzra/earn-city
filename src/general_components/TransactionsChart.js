import{ Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler );

function prepareTransactionData(wallet) {
    const dataMap = {};

    wallet.forEach(({ t_created_at, t_type, t_amount }) => {
        const date = new Date(t_created_at).toISOString().split("T")[0];

        if (!dataMap[date]) {
            dataMap[date] = { credited: 0, debited: 0};
        }
        if (t_type.includes("credited")) {
            dataMap[date].credited += t_amount;

        }
        else if (t_type.includes("debited")) {
            dataMap[date].debited += t_amount;
        }
    });
    
    return Object.entries(dataMap).map(([date, {credited, debited}]) => ({
        date,
        credited,
        debited
    }));
}

function TransactionChart ({ wallet }) {
    const transactionData = prepareTransactionData(wallet);
    console.log('Prepared data', transactionData);

    const graphData = {
        lables: transactionData.map((d) => d.date),
        datasets : [
            {
                label: "credited(received)",
                data: transactionData.map((d) => d.credited),
                borderColor: "green",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                fill: true
            },
            {
                label: "debited(sent)",
                data: transactionData.map((d) => d.debited),
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                fill: true
            }
        ]
    };

    return <Line data={graphData} />;
}
export default TransactionChart;