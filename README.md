# Functional Programming 都可以當你阿公了 Part 2

## Realworld Example

[sentence-splitter](https://github.com/tainvecs/sentence-splitter)

## 閱讀

[輕量級函式編程](https://github.com/getify/Functional-Light-JS)
[函式指北針](https://github.com/MostlyAdequate/mostly-adequate-guide)
[組合軟體](https://medium.com/javascript-scene/composing-software-the-book-f31c77fc3ddc)

### 一點歷史

在電腦科學的早期，連電腦都還沒問世的年代，
有兩位偉大的數學家奠定了當今電腦科學的兩大基礎，

- [阿隆佐·邱奇 Alonzo Church](https://en.wikipedia.org/wiki/Alonzo_Church)
  [λ 演算 lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus)
- [艾倫·圖靈 Alan Turing](https://en.wikipedia.org/wiki/Alan_Turing)
  [圖靈機](https://en.wikipedia.org/wiki/Lambda_calculus)

> λ 演算 => Lisp => Clojure / Racket => ...

[Scheme](<https://en.wikipedia.org/wiki/Scheme_(programming_language)>) => [Javascript](https://en.wikipedia.org/wiki/JavaScript)

## First Class Function

[一級函式](https://hello-kirby.hashnode.dev/mostly-adequate-guide-to-fp-chapter-02)

函式是一等公民，
就是指 函式跟其他物件一樣 沒有什麼特別。
他可以儲存在陣列裏，當成參數傳遞，賦值給變數，你想怎麼樣都行。

> 純物件導向的語言，函式必須附庸在 `class` 底下。

```java
class Obj {
  method() {

  }
}
```

```javascript
const hi = (name) => `Hi ${name}`;
const greeting = (name) => hi(name);
```

```javascript
const greeting = hi;
greeting("Hello"); // Hi Hello
```

`hi` 已經是個函式且可以接受一個參數，
為什麼需要另外定一個函式然後只是單純把同樣的參數丟去呼叫 `hi`？

## Higher Order Function

高階函式是指一種函式的種類，他可以：

- 接收一個或多個函式做為傳入值
- 回傳函式做為其結果

> 在數學領域稱作 _算子 (Operator)_
> 簡單來說就是把某個函式映射到另一函式，例如 _微分 (Differential Operator)_。

## Currying

[柯里](https://hello-kirby.hashnode.dev/chapter-04-currying)

它的概念非常簡單：你可以只傳一部份的參數來執行一個函式，
它會回傳一個新的函式來處理剩下的參數。
直到你把剩下的參數都填完，他才會執行函式。

> Partial Application
