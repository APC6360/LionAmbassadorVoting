import React, { createContext, useState, useContext, useEffect } from 'react';

const WalletContext = createContext({
  account: '',
  isConnected: false,
  chainId: null,
  connectWallet: () => Promise.resolve(null),
  disconnectWallet: () => {}
});

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);

  
  const hasEthereum = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!hasEthereum()) return;

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chainId);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!hasEthereum()) {
        console.error("Ethereum object not found");
        return null;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chainId);
        
        localStorage.setItem('isWalletConnected', 'true');
        localStorage.setItem('walletAddress', accounts[0]);
        
        return accounts[0];
      }
      
      return null;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return null;
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
    setChainId(null);
    localStorage.removeItem('isWalletConnected');
    localStorage.removeItem('walletAddress');
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      localStorage.setItem('walletAddress', accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(chainId);
  };

  useEffect(() => {
  
    if (typeof window !== 'undefined') {
      const isWalletConnected = localStorage.getItem('isWalletConnected');
      
      if (isWalletConnected === 'true') {
        checkIfWalletIsConnected();
      }

    
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        
   
        return () => {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
      }
    }
  }, []);

  const value = {
    account,
    isConnected,
    chainId,
    connectWallet,
    disconnectWallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);

export default WalletContext;