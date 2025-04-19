"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import confetti from "canvas-confetti"
import { Heart, Cake, Gift, Sparkles, Star, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"

// クイズの定義
const quizQuestions = [
  {
    question: "willowの好きな食べ物はティラミスである。",
    options: [
      { value: "yes", label: "はい", correct: true },
      { value: "no", label: "いいえ", correct: false },
    ],
  },
  {
    question: "willowは実は日本語が上手である。",
    options: [
      { value: "yes", label: "はい", correct: true },
      { value: "no", label: "いいえ", correct: false },
    ],
  },
  {
    question: "willowは今年21歳である。",
    options: [
      { value: "yes", label: "はい", correct: true },
      { value: "no", label: "いいえ", correct: false },
    ],
  },
  {
    question: "willowの誕生日は4/20日である。",
    options: [
      { value: "yes", label: "はい", correct: false },
      { value: "no", label: "いいえ", correct: true },
    ],
  },
  {
    question: "willowは歌が上手。",
    options: [
      { value: "yes", label: "はい", correct: true },
      { value: "no", label: "いいえ", correct: false },
    ],
  },
]

export default function BirthdayPage() {
  const [name, setName] = useState("ハッピーバースデー、willow！")
  const [customName, setCustomName] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showBirthdayCard, setShowBirthdayCard] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizResult, setQuizResult] = useState<boolean | null>(null)
  const [progress, setProgress] = useState(0)
  const [showStars, setShowStars] = useState(false)

  useEffect(() => {
    // クイズの進捗状況を更新
    setProgress(((currentQuestionIndex + 1) / quizQuestions.length) * 100)
  }, [currentQuestionIndex])

  useEffect(() => {
    if (quizCompleted && quizResult) {
      // クイズに正解したら誕生日カードを表示
      setShowBirthdayCard(true)

      // 紙吹雪を表示（より派手に）
      launchConfetti()

      // 5秒後に星のエフェクトを表示
      setTimeout(() => {
        setShowStars(true)
      }, 1000)
    }
  }, [quizCompleted, quizResult])

  const launchConfetti = () => {
    // より派手な紙吹雪エフェクト
    const duration = 8 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 80 * (timeLeft / duration)

      // 色々な色と形の紙吹雪を作成（より多く）
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#ff0000", "#ffa500", "#ffff00", "#008000", "#0000ff", "#4b0082", "#ee82ee"],
        shapes: ["circle", "square", "star"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#ff0000", "#ffa500", "#ffff00", "#008000", "#0000ff", "#4b0082", "#ee82ee"],
        shapes: ["circle", "square", "star"],
      })
    }, 250)

    return () => clearInterval(interval)
  }

  const handleCustomize = () => {
    if (customName.trim() !== "") {
      setName(customName)
      setShowForm(false)
      // カスタマイズ後に紙吹雪を表示
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff0000", "#ffa500", "#ffff00", "#008000", "#0000ff", "#4b0082", "#ee82ee"],
      })
    }
  }

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = value
    setAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // クイズ完了、結果を確認
      const allCorrect = quizQuestions.every((q, index) => {
        const selectedOption = q.options.find((opt) => opt.value === answers[index])
        return selectedOption?.correct
      })

      setQuizResult(allCorrect)
      setQuizCompleted(true)

      if (allCorrect) {
        // 正解したら紙吹雪を表示
        launchConfetti()
      }
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setAnswers([])
    setQuizCompleted(false)
    setQuizResult(null)
    setShowBirthdayCard(false)
    setShowStars(false)
  }

  const currentQuestion = quizQuestions[currentQuestionIndex]
  const hasAnswered = answers[currentQuestionIndex] !== undefined

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-300 via-purple-200 to-blue-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* キラキラ背景エフェクト */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 8 + 2,
              height: Math.random() * 8 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* 星のエフェクト（クイズ正解後） */}
      {showStars && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: [0, 360],
                y: [0, -100],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
              }}
            >
              <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!showBirthdayCard ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-300 shadow-lg">
              <CardContent className="p-6">
                {!quizCompleted ? (
                  <div className="space-y-6">
                    <div className="text-center mb-4">
                      <h2 className="text-2xl font-bold text-pink-600">友達クイズ</h2>
                      <p className="text-gray-600">全問正解するとお祝いメッセージが表示されます！</p>

                      <div className="mt-4">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-gray-500 mt-1">
                          問題 {currentQuestionIndex + 1}/{quizQuestions.length}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <h3 className="text-lg font-medium text-pink-700 mb-2">{currentQuestion.question}</h3>

                        <RadioGroup
                          value={answers[currentQuestionIndex]}
                          onValueChange={handleAnswerSelect}
                          className="space-y-2"
                        >
                          {currentQuestion.options.map((option) => (
                            <div
                              key={option.value}
                              className="flex items-center space-x-2 bg-white p-3 rounded-md border border-gray-200 hover:border-pink-300 transition-colors"
                            >
                              <RadioGroupItem value={option.value} id={option.value} />
                              <Label htmlFor={option.value} className="flex-grow cursor-pointer">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>

                    <Button
                      onClick={handleNextQuestion}
                      disabled={!hasAnswered}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white h-12 text-lg font-medium"
                    >
                      {currentQuestionIndex < quizQuestions.length - 1 ? "次の問題へ" : "結果を見る"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <h2 className="text-2xl font-bold text-pink-600">クイズ結果</h2>

                    {quizResult ? (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="rounded-full bg-green-100 p-4">
                            <Check className="h-10 w-10 text-green-600" />
                          </div>
                        </div>
                        <p className="text-xl text-gray-700 font-medium">おめでとう！全問正解です！</p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => setShowBirthdayCard(true)}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white h-12 text-lg font-medium"
                          >
                            お祝いメッセージを見る
                          </Button>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="rounded-full bg-red-100 p-4">
                            <X className="h-10 w-10 text-red-600" />
                          </div>
                        </div>
                        <p className="text-xl text-gray-700 font-medium">残念！もう一度チャレンジしてみましょう。</p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={resetQuiz}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white h-12 text-lg font-medium"
                          >
                            もう一度挑戦する
                          </Button>
                        </motion.div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="birthdayCard"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            <Card className="bg-gradient-to-r from-pink-100 to-purple-100 backdrop-blur-sm border-2 border-pink-300 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      y: [0, -10, 0],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 5,
                      ease: "easeInOut",
                    }}
                    className="relative inline-block w-32 h-32 mx-auto"
                  >
                    <div className="absolute inset-0 bg-pink-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <Image src="/penguin.png" alt="ペンギン" width={128} height={128} className="drop-shadow-lg" />
                  </motion.div>

                  <motion.h1
                    className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-500 to-blue-500 mt-4 mb-2"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                    }}
                  >
                    {name}
                  </motion.h1>
                  <p className="text-gray-700 text-lg">今日は君の特別な日だね！</p>
                </div>

                <motion.div
                  className="relative h-56 my-6 rounded-xl overflow-hidden border-4 border-white shadow-lg"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 4,
                      }}
                      className="w-40 h-40 relative"
                    >
                      <Image src="/penguin.png" alt="ペンギン" fill className="object-contain drop-shadow-xl" />
                    </motion.div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4">
                    <motion.p
                      className="text-white text-2xl font-bold px-6 py-3 bg-pink-500/80 rounded-lg shadow-lg"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    >
                      最高の一年になりますように！
                    </motion.p>
                  </div>
                </motion.div>

                <div className="flex justify-center gap-4 mb-8">
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -15, 0],
                        scale: [1, 1.2, 1],
                        rotate: [0, i % 2 === 0 ? 10 : -10, 0],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 2,
                        delay: i * 0.15,
                      }}
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
                        {i % 4 === 0 ? (
                          <Heart className="h-5 w-5 text-white" />
                        ) : i % 4 === 1 ? (
                          <Gift className="h-5 w-5 text-white" />
                        ) : i % 4 === 2 ? (
                          <Cake className="h-5 w-5 text-white" />
                        ) : (
                          <Sparkles className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center bg-white/50 p-4 rounded-lg backdrop-blur-sm">
                  <p className="text-gray-700 mb-6 text-lg">楽しい誕生日を過ごしてね！いつも笑顔でいてね！</p>

                  <motion.div className="flex justify-center gap-4" whileHover={{ scale: 1.03 }}>
                    <Button
                      variant="outline"
                      className="bg-pink-100 hover:bg-pink-200 text-pink-700 border-pink-300 px-6 py-2 h-auto"
                      onClick={() => setShowForm(!showForm)}
                    >
                      カスタマイズ
                    </Button>

                    <Button
                      variant="outline"
                      className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300 px-6 py-2 h-auto"
                      onClick={resetQuiz}
                    >
                      クイズに戻る
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* カスタマイズフォーム */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="mt-6 w-full max-w-md"
                >
                  <Card className="border border-pink-300 bg-white/90 shadow-lg">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="customName" className="text-lg font-medium text-pink-700">
                            お祝いメッセージをカスタマイズ
                          </Label>
                          <Input
                            id="customName"
                            placeholder="例：山田さん、お誕生日おめでとう！"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            className="mt-2 border-pink-200 focus:border-pink-400"
                          />
                        </div>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button
                            onClick={handleCustomize}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white h-12 text-lg font-medium"
                          >
                            変更を適用
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
