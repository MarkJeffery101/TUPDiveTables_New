const Header = () => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2 items-center">
        <div className="col-span-2 font-bold flex items-center">
          CODE: <span className="text-accent ml-2">AoxTUP2C</span>
        </div>
        <div className="col-span-2 text-right text-text-muted whitespace-nowrap">
          Copyright DadCoDat 2013, Version 2023
        </div>
        <div className="col-span-full md:col-span-2 font-bold">
          Air - Oxygen decompression tables for TUP diving on <span className="text-accent">Air</span>
        </div>
      </div>
      <div className="col-span-full flex justify-between text-text-muted mt-2">
        <div>Repetitive interval is <span className="font-bold">16 Hours</span></div>
        <div>Stop time starts after arrival at the stop</div>
      </div>
      <div className="col-span-full flex flex-col sm:flex-row justify-between text-text-muted italic mt-2 text-sm">
        <span className="flex-1 text-left">Pressure in m/sw</span>
        <span className="flex-1 text-center">Time in minutes and tenth of minutes</span>
        <span className="flex-1 text-right">Ascent speed is 10 msw/min</span>
      </div>
      <div className="col-span-full border-t border-dashed border-border mt-3 pt-2" />
    </>
  );
};

export default Header;
