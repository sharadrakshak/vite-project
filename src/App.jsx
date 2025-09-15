import React, { useState } from 'react';
import MainScreen from './screens/MainScreen';
import SearchScreen from './screens/SearchScreen';

function App() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div>
      {showSearch ? (
        <SearchScreen onBack={() => setShowSearch(false)} />
      ) : (
        <MainScreen onSearch={() => setShowSearch(true)} />
      )}
    </div>
  );
}

export default App;
