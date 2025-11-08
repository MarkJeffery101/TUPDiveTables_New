import Header from './components/Header';
import InputOutputSection from './components/InputOutputSection';
import StatusBar from './components/StatusBar';
import DecompressionTable from './components/DecompressionTable';
import useDivingCalculator from './hooks/useDivingCalculator';

function App() {
  const {
    inputs,
    handleInputChange,
    outputs,
    filteredRecords,
    statusMessage,
    selfTestResult,
    selectedRowIndex,
    handleRowClick,
  } = useDivingCalculator();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-card-bg border border-border rounded-xl p-3 sm:p-4 shadow-DEFAULT">
        <Header />
        <InputOutputSection 
          inputs={inputs}
          onInputChange={handleInputChange}
          outputs={outputs}
        />
      </div>
      <StatusBar statusMessage={statusMessage} selfTestResult={selfTestResult} />
      <DecompressionTable 
        records={filteredRecords}
        selectedRowIndex={selectedRowIndex}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

export default App;
