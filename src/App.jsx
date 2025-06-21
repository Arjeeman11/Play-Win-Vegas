import { Trophy, Gift, Share2, Gamepad2, MonitorSmartphone, Wallet, History } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "./firebase"; // ✅ Correct Firebase import
import { collection, query, orderBy, limit, getDocs, updateDoc, doc, addDoc, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [user, setUser] = useState({ uid: "test-user-001" });
  const [points, setPoints] = useState(0);
  const [triviaQuestion, setTriviaQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [referralLink, setReferralLink] = useState("https://play2winhub.com/signup?ref=12345");
  const [payoutInfo, setPayoutInfo] = useState({ method: "GCash", account: "" });
  const [payoutHistory, setPayoutHistory] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const q = query(collection(db, "users"), orderBy("points", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      const leaders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeaderboard(leaders);
    };

    const fetchHistory = async () => {
      if (!user) return;
      const q = query(collection(db, "payoutRequests"), where("uid", "==", user.uid), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPayoutHistory(history);
    };

    fetchLeaderboard();
    fetchHistory();
  }, [user]);

  const requestCashout = async () => {
    if (points < 500) return alert("You need at least 500 points to cash out.");
    if (!payoutInfo.account.trim()) return alert("Please enter your account details.");
    await addDoc(collection(db, "payoutRequests"), {
      uid: user.uid,
      method: payoutInfo.method,
      account: payoutInfo.account,
      points: 500,
      status: "pending",
      createdAt: new Date()
    });
    const newPoints = points - 500;
    setPoints(newPoints);
    await updateDoc(doc(db, "users", user.uid), { points: newPoints });
    alert("💸 Payout request submitted! Expect processing within 24–72 hours.");
  };

  const fetchTrivia = async () => {
    const q = "What is the capital of France?";
    const a = "Paris";
    setTriviaQuestion({ question: q, answer: a });
  };

  const submitAnswer = () => {
    if (!triviaQuestion) return;
    if (userAnswer.trim().toLowerCase() === triviaQuestion.answer.toLowerCase()) {
      const bonus = 10;
      const newPoints = points + bonus;
      setPoints(newPoints);
      updateDoc(doc(db, "users", user.uid), { points: newPoints });
      alert("🎉 Correct! +10 points");
    } else {
      alert("❌ Wrong answer. Try again!");
    }
    setTriviaQuestion(null);
    setUserAnswer("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-yellow-700 to-yellow-400 p-6 text-white space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-center mb-4 drop-shadow-lg"
      >
        🌰 Play2Win Hub 🎉
      </motion.h1>

      {/* Request Payout */}
      <Card className="bg-purple-800 text-white shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-2">💸 Request Payout</h2>
          <p className="text-sm mb-2">Exchange 500 points for ₱50 via GCash or PayPal</p>
          <select
            className="text-black mb-2 w-full p-2 rounded"
            value={payoutInfo.method}
            onChange={e => setPayoutInfo({ ...payoutInfo, method: e.target.value })}
          >
            <option value="GCash">GCash</option>
            <option value="PayPal">PayPal</option>
          </select>
          <Input
            placeholder={payoutInfo.method === "GCash" ? "Enter GCash number" : "Enter PayPal email"}
            value={payoutInfo.account}
            onChange={e => setPayoutInfo({ ...payoutInfo, account: e.target.value })}
            className="mb-2 text-black"
          />
          <Button onClick={requestCashout} className="bg-white text-purple-800 w-full">Request ₱50 Payout</Button>
          <p className="mt-2 text-xs italic text-white/80">Payouts processed within 24–72 hours. One request per day. 🎉</p>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card className="bg-yellow-800 text-white shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">📜 Payout History</h2>
          {payoutHistory.length === 0 ? (
            <p className="text-sm">No payout requests yet.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {payoutHistory.map(entry => (
                <li key={entry.id} className="border-b border-white/20 pb-1">
                  {entry.method} - {entry.account} - {entry.points} pts - <span className="capitalize">{entry.status}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Trivia Game */}
      <Card className="bg-pink-700 text-white shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-2">🎓 Trivia Game</h2>
          {triviaQuestion ? (
            <>
              <p className="mb-2">{triviaQuestion.question}</p>
              <Input
                placeholder="Your answer"
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                className="text-black mb-2"
              />
              <Button onClick={submitAnswer} className="bg-white text-pink-700 w-full">Submit Answer</Button>
            </>
          ) : (
            <Button onClick={fetchTrivia} className="bg-white text-pink-700 w-full">Start Trivia</Button>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="bg-blue-700 text-white shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">🏆 Leaderboard</h2>
          <ul className="text-sm space-y-1">
            {leaderboard.map((user, index) => (
              <li key={user.id} className="flex justify-between border-b border-white/20 pb-1">
                <span>#{index + 1} {user.name || user.id}</span>
                <span>{user.points} pts</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Referral Link */}
      <Card className="bg-green-700 text-white shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-2">📣 Referral Link</h2>
          <p className="text-sm mb-2">Share this link to invite friends and earn bonus points:</p>
          <div className="bg-white text-black rounded p-2 mb-2 text-sm overflow-x-auto">{referralLink}</div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(referralLink);
              alert("Referral link copied!");
            }}
            className="bg-white text-green-700 w-full"
          >
            Copy Link
          </Button>
        </CardContent>
      </Card>

      {/* Install App Tip */}
      <Card className="bg-gray-800 text-white shadow-xl rounded-2xl">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">📱 Install as App</h2>
          <p className="text-sm mb-2">For the best experience, add Play2Win Hub to your home screen!</p>
          <p className="text-xs italic">On mobile: Tap Share → Add to Home Screen</p>
        </CardContent>
      </Card>
    </div>
  );
}
