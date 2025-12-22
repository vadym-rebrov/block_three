import React from 'react';
import Button from 'components/Button';
import Typography from 'components/Typography';
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
    paginationContainer:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        marginTop: '24px',
        paddingBottom: '24px',
        position: 'relative'
    }
});

function Pagination({ currentPage, totalPages, onPageChange }) {
    const classes = useStyles();

    if (totalPages <= 1) return null;

    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 3);
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    const isFirstPageHidden = startPage > 0;
    const isLastPageHidden = endPage < totalPages - 1;

    return (
        <div className={classes.paginationContainer}>
            <Button
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                variant="text"
            >
                {"<"}
            </Button>

            {isFirstPageHidden && (
                <>
                    <Button
                        variant="secondary"
                        onClick={() => onPageChange(0)}
                        style={{ minWidth: '40px' }}
                    >
                        <Typography>1</Typography>
                    </Button>
                    {startPage > 1 && <Typography>...</Typography>}
                </>
            )}

            {pages.map((pageIndex) => (
                <Button
                    key={pageIndex}
                    variant={currentPage === pageIndex ? "primary" : "secondary"}
                    colorVariant={currentPage === pageIndex ? "primary" : "secondary"}
                    onClick={() => onPageChange(pageIndex)}
                    style={{ minWidth: '40px' }}
                >
                    <Typography color={currentPage === pageIndex ? "inherit" : "primary"}>
                        {pageIndex + 1}
                    </Typography>
                </Button>
            ))}

            {isLastPageHidden && (
                <>
                    {endPage < totalPages - 2 && <Typography>...</Typography>}
                    <Button
                        variant="secondary"
                        onClick={() => onPageChange(totalPages - 1)}
                        style={{ minWidth: '40px' }}
                    >
                        <Typography>{totalPages}</Typography>
                    </Button>
                </>
            )}

            <Button
                disabled={currentPage >= totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
                variant="text"
            >
                {">"}
            </Button>
        </div>
    );
}

export default Pagination;