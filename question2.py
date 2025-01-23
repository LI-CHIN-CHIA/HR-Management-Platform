def fibonacci_recursive(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)

def fibonacci_iterative(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1

    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# 請輸入數字後再呼叫函式
n = int(input("請輸入一個非負整數 n："))
print(f"斐波那契數列第 {n} 項（遞迴方式）：{fibonacci_recursive(n)}")
print(f"斐波那契數列第 {n} 項（非遞迴方式）：{fibonacci_iterative(n)}")
