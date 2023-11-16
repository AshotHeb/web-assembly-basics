#include <emscripten.h>
#include <stdlib.h>

typedef struct {
    int a;
    int b;
    float c;
} pair;

typedef struct {
    long long val;
    char a;
} sub_s;

int main (){
    return 0;
}

EMSCRIPTEN_KEEPALIVE
int function(int a ,double d , float f);

EMSCRIPTEN_KEEPALIVE
float computeSum(pair *p) {
    return (float)(p->a + p->b) + p->c;
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
pair *createPair(int a ,int b) {
    pair *p = malloc(sizeof(pair));
    p->a = a;
    p->b = b;

    return p;
}