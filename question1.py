def reverse_integer(x):
    result = 0
    is_negative = x < 0  # 檢查是否為負數
    x = abs(x)  # 先取絕對值來處理正負數統一邏輯
    
    while x != 0:
        digit = x % 10  # 取出最後一位數字
        result = result * 10 + digit  # 將數字加到結果的最後一位
        x //= 10  # 去掉已經處理過的位數
    
    return -result if is_negative else result  # 若原本是負數，結果加上負號

# 讓使用者輸入數字
try:
    user_input = int(input("請輸入一個數字: "))
    reversed_number = reverse_integer(user_input)
    print(f"反轉後的數字是: {reversed_number}")
except ValueError:
    print("請輸入有效的整數！")
