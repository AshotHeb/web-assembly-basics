#include <emscripten.h>

int add(int a ,int b);
int sub(int a ,int b);
int div(int a ,int b);
int mult(int a ,int b);


EMSCRIPTEN_KEEPALIVE
int sumOfNInts (int n ) {
  return div(mult(n, add(n,1)),2); 
}