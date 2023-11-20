#include <emscripten.h>
#include <stdlib.h>

typedef struct {
    int val;
    int a;
} sub_s;

typedef struct {
    int a;
    int b;
    sub_s structure;
} s;



int main (){
    return 0;
}

EMSCRIPTEN_KEEPALIVE
int function(int a ,double d , float f);

EMSCRIPTEN_KEEPALIVE
float computeSum(s *p) {
    return p->a + p->b ;
}


EMSCRIPTEN_KEEPALIVE
void *wasmmalloc (int size) {
    return malloc(size);
}

EMSCRIPTEN_KEEPALIVE
void wasmfree (void *ptr) {
    free(ptr);
}

EMSCRIPTEN_KEEPALIVE
s *createPair(int a ,int b) {
    s *p = malloc(sizeof(s));
    p->a = a;
    p->b = b;

    return p;
}



EMSCRIPTEN_KEEPALIVE
s *createStruct (int a ,int b ,int l,int c) {
    /*malloc ը ավտոմատ տարածք ա հատկացնում հիշողության մեջ */
    s *p = malloc(sizeof(s));
    p->a = a;
    p->b = b;
    p->structure.val = l;
    p->structure.a = c;

    return p;
} 

EMSCRIPTEN_KEEPALIVE
int computeSum2(s *obj) {
    return obj->a * obj->b + obj->structure.val / obj->structure.a;
}