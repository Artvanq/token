'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

declare global {
  interface Window {
    ethereum?: any;
  }
}

const presaleAddress = '0x0fC5025C764cE34df352757e82f7B5c4Df39A836'

export default function Home() {
  const [account, setAccount] = useState('')
  const [price, setPrice] = useState('')
  const [ethValue, setEthValue] = useState('')
  const [neoToReceive, setNeoToReceive] = useState('')

  async function connectWallet() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const addr = await signer.getAddress()
    setAccount(addr)
  }

  async function fetchPrice() {
    const provider = new ethers.JsonRpcProvider()
    const contract = new ethers.Contract(presaleAddress, ["function currentPrice() public view returns (uint256)"], provider)
    const result = await contract.currentPrice()
    setPrice(ethers.formatEther(result))
  }

  async function buyTokens() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(presaleAddress, ["function buyTokens() public payable"], signer)
    await contract.buyTokens({ value: ethers.parseEther(ethValue) })
    fetchPrice()
  }

  useEffect(() => { fetchPrice() }, [])

  useEffect(() => {
    if (ethValue && price) {
      const tokens = parseFloat(ethValue) / parseFloat(price)
      setNeoToReceive(tokens.toFixed(2))
    }
  }, [ethValue, price])

  return (
    <main style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: '#111', borderRadius: '8px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Neuron Presale</h1>
      <p>Current Price: <strong>{price || 'Loading...'} ETH</strong></p>
      <input
        type="number"
        placeholder="ETH amount"
        value={ethValue}
        onChange={(e) => setEthValue(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '12px', borderRadius: '4px' }}
      />
      <p>You will receive: {neoToReceive} NEO</p>
      <button
        onClick={account ? buyTokens : connectWallet}
        style={{ padding: '10px 20px', backgroundColor: '#2563eb', borderRadius: '6px', color: '#fff', width: '100%' }}
      >
        {account ? 'Buy NEO' : 'Connect Wallet'}
      </button>
    </main>
  )
}
