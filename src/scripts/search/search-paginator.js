import React, {useEffect, useState} from 'react';

export const Paginator = (pagesize, count) => {
    const pages = () => {
        console.log(pagesize)
        console.log(count)
        const calculatedCount = Math.ceil(count / pagesize);
        console.log(calculatedCount)
        return calculatedCount
    }
    return (<div>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>totaal {count}</div>
        <div>pagina's {pages()}</div>
        <div>item's per pageina {pagesize}</div>
    </div>)
}