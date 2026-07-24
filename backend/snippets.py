"""
C/C++ Code Snippets and Templates
"""

SNIPPETS = {
    "hello_world_c": {
        "label": "Hello World (C)",
        "language": "c",
        "code": '''#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}'''
    },
    "hello_world_cpp": {
        "label": "Hello World (C++)",
        "language": "cpp",
        "code": '''#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}'''
    },
    "input_output_c": {
        "label": "Input/Output (C)",
        "language": "c",
        "code": '''#include <stdio.h>

int main() {
    int num;
    printf("Enter a number: ");
    scanf("%d", &num);
    printf("You entered: %d\\n", num);
    return 0;
}'''
    },
    "for_loop": {
        "label": "For Loop",
        "language": "c",
        "code": '''for (int i = 0; i < 10; i++) {
    printf("%d\\n", i);
}'''
    },
    "while_loop": {
        "label": "While Loop",
        "language": "c",
        "code": '''int i = 0;
while (i < 10) {
    printf("%d\\n", i);
    i++;
}'''
    },
    "array": {
        "label": "Array Operations",
        "language": "c",
        "code": '''#include <stdio.h>

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    
    return 0;
}'''
    },
    "function": {
        "label": "Function Definition",
        "language": "c",
        "code": '''int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(5, 3);
    printf("Sum: %d\\n", result);
    return 0;
}'''
    },
    "struct": {
        "label": "Struct Definition",
        "language": "c",
        "code": '''#include <stdio.h>

struct Point {
    int x;
    int y;
};

int main() {
    struct Point p;
    p.x = 10;
    p.y = 20;
    printf("(%d, %d)\\n", p.x, p.y);
    return 0;
}'''
    },
    "pointer": {
        "label": "Pointer Usage",
        "language": "c",
        "code": '''#include <stdio.h>

int main() {
    int x = 10;
    int *ptr = &x;
    
    printf("Value: %d\\n", *ptr);
    printf("Address: %p\\n", ptr);
    
    return 0;
}'''
    },
    "dynamic_memory": {
        "label": "Dynamic Memory Allocation",
        "language": "c",
        "code": '''#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int*)malloc(n * sizeof(int));
    
    for (int i = 0; i < n; i++) {
        arr[i] = i * 2;
        printf("%d ", arr[i]);
    }
    
    free(arr);
    return 0;
}'''
    }
}
